# Sword Health Test

### Creating a migration
```
npx sequelize-cli migration:create --name add-test-user-field
```

- Run the migration (see Running the migration)

### Running the migration (this runs all pending migrations):
```
npx sequelize-cli db:migrate --debug

```

### Undo the migration, if needed (this reverts only the latest one)
```
npx sequelize-cli db:migrate:undo

```
