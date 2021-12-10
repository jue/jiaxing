## Linux/MacOS 开发

#### 环境依赖

- mongodb
- redis
- nodejs
- yarn

#### 启动服务

```
  yarn install
  yarn dev
```

## Window 开发

#### 环境依赖

- python
- mongodb
- redis
- visual studio 2017
- nodejs
- yarn
- git-bash

#### 启动服务

```

  cd [prodect dir]

  ./node_modules/.bin/tsc-watch -p ./tsconfig.server.json --onSuccess 'node ./bin/server/index.js' --onFailure 'echo Beep! Compilation Failed' --compiler typescript/bin/tsc

```

#### VS Code Plugin

- EditorConfig for VScode
- Prettier
- PlantUML

#### 查看 `docs` 目录下的 `PlantUML`
