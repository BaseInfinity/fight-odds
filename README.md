# fight-odds
Get Live Fighting Odds and Win Chance % for Boxing and UFC Events

https://user-images.githubusercontent.com/1424113/209426048-d59cefba-de3d-46ee-9b3a-fe1604b9afa7.mov

Installation instructions if you want to run your own bot, but tweak the settings! Also be sure to add your own `config.json` =)

```
sudo npm install -g pnpm

gh repo clone BaseInfinity/fight-odds

pnpm install

sudo npm install -g ts-node

npx ts-node deploy-commands.ts

npm install forever -g

forever start -v -c ts-node .
```
