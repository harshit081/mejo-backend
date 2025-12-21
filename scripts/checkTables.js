const { sequelize } = require('../config/db');

const DEFAULT_SCHEMA = process.env.PG_SCHEMA || 'public';
const FORCE_SYNC = process.env.PG_FORCE_SYNC === 'true' || process.argv.includes('--force');
const requiredTables = [
    `${DEFAULT_SCHEMA}.users`,
    `${DEFAULT_SCHEMA}.otp`,
    `${DEFAULT_SCHEMA}.tokens`,
    `${DEFAULT_SCHEMA}.password_resets`,
];

const normalize = (value) => (typeof value === 'string' ? value.toLowerCase() : '');

const extractTableNames = (entries) => {
    const tableSet = new Set();

    entries.forEach((entry) => {
        if (!entry) {
            return;
        }

        if (typeof entry === 'string') {
            const normalized = normalize(entry);
            if (normalized) {
                tableSet.add(normalized);
            }
            return;
        }

        const table = normalize(entry.tableName || entry.name || entry.table_name);
        const schema = normalize(entry.schema || entry.tableSchema || entry.table_schema);

        if (table) {
            tableSet.add(table);
        }

        if (table && schema) {
            tableSet.add(`${schema}.${table}`);
        }
    });

    return tableSet;
};

async function ensureTables() {
    const queryInterface = sequelize.getQueryInterface();

    try {
        await sequelize.authenticate();
        const rawTables = await queryInterface.showAllTables();
        const existingTableSet = extractTableNames(rawTables);

        if (FORCE_SYNC) {
            console.log('PG_FORCE_SYNC enabled or --force flag detected. Performing sequelize.sync({ force: true }).');
            await sequelize.sync({ force: true });
            console.log('Force sync completed successfully; database schema recreated.');
            return;
        }

        const missingTables = requiredTables.filter(
            (table) => !existingTableSet.has(table) && !existingTableSet.has(table.split('.').pop())
        );

        if (missingTables.length === 0) {
            console.log('All required tables already exist.');
            return;
        }

        console.log(`Existing tables that were detected: ${Array.from(existingTableSet).join(', ') || 'none'}`);
        console.log(`Missing tables detected: ${missingTables.join(', ')}.`);
        console.log('Running sequelize.sync({ alter: true }) to create/update tables...');
        await sequelize.sync({ alter: true });
        console.log('Database schema synced successfully.');
    } catch (error) {
        console.error('Failed to ensure required tables:', error);
        throw error;
    } finally {
        try {
            await sequelize.close();
        } catch (closeError) {
            console.error('Failed to close Sequelize connection:', closeError);
        }
    }
}

ensureTables().catch(() => {
    process.exitCode = 1;
});
