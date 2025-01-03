# djs-boilerplate

A high-level, opinionated, and feature-rich Discord.js bot boilerplate

## Features

- **Slash & Context Menu Commands**: 
  - Automatically registered and loaded from the `commands` directory.
  - Permissions are automatically handled based on the command's `permissions` property.
  - Guards are automatically applied based on the command's `guards` property.
  - Category support.
  - Typesafe.
- **Events**:
  - Automatically registered and loaded from the `events` directory.
  - Typesafe.
- **Guard System**:
  - A simple and powerful guard system.
  - Guards are basically middlewares that can be applied to commands and triggers.
  - Guards can be applied to commands and triggers.
  - Typesafe.
- **Trigger System**:
  - A simple and powerful trigger system.
  - Triggers are basically interaction handlers that can be applied to buttons, select menus, and modals.
  - Typesafe.
- **Config System**:
  - A simple and powerful config system.
  - Automatically loaded from the `config` directory.
  - Can have multiple configurations in different files.
  - Fully customizable.
  - Typesafe.
- **Database System**:
  - A simple and powerful database system.
  - `TypeORM` is used for database management.
  - `DatabaseHelper` class is used for database operations.
  - Typesafe.

## Credits

This project is heavily inspired by [Colossus](https://github.com/RyanLandDev/Colossus)
*Colossus* is JDA framework for creating Discord bots with ease.

## Support

If you need help with this project, you can send me a message on Discord (`camdzic`) or open an issue on GitHub.