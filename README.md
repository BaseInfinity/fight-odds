# fight-odds
https://top.gg/bot/1053113817040695357

Get Live Fighting Odds and Win Chance % for Boxing and UFC Events


https://user-images.githubusercontent.com/1424113/215630297-7d720274-7301-4c3c-af25-ed6d3bbb03be.mov


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
