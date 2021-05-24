## BaccLib - Library for [Bacc] and many more bots!
#### This is an NPM Package for [Bacc] and many other bots for levelling, economy and fun[WIP] commands!
---
### Installation
```sh
$npm install bacclib@latest
```
---
### Commands
- [Levelling]
- [Economy]
---
### Levelling System
##### - To start making a levelling system for your bot, you need to make a file named `levels.js` (or any other file name you want)
---
```js
//levels.js
const { levelling } = require('bacclib')
const a = 9 //or any number. this will make so everytime a member says something, the member will get a random amount of xp between 1 and the number you specify here!
levelling.setURL('<your mongodb url here>')
module.exports = async(client) => {
    client.on('message', async(message) => {
        if(!message.guild) return //will make so if you sent a message in dms, it wont give you XP!
        if(message.author.bot) return // will make so that any bot doesnt get XP!
        if(message.content.startsWith('<your bot prefix here>')) return //will make so bot doesnt give XP when using a command!
        
        const randomXp = Math.floor(Math.random() * a) + 1
        const hasLevelledUp = await levelling.addXp(message.author.id, message.guild.id, randomXp)
        const user = await levelling.fetchXp(message.author.id, message.guild.id);
        if(hasLevelledUp) {
            message.channel.send(`Congrats <@${message.author.id}, you have levelled up to ${user.level}!`) //you can also make this as an embed
        }
    })
}
```
##### - If you want to make global levelling roles, then add the following to your `levels.js`
```js
if(user.level = 1) {
    const role = message.guild.roles.cache.find(r => r.name.includes('Level 1'))
    message.guild.member(message.author.id).roles.add(role)
}
//the above code will make so that when a member reaches level 1, the member will recieve a role which has 'Level 1' in its name!
```

##### - If you want to make custom levelling roles, then add the following to your `levels.js`
```js
if(user.level = 1) {
const role = message.guild.roles.cache.find(r => r.id === '<your role id here>')
    message.guild.member(message.author.id).roles.add(role)
}
//the above code will make so that when a member reaches level 1, the member will recieve a custom role role which id has been specified!
```

##### - To enable the levelling system, you just have to add the following in your `index.js` (or whatever your main file name is)
```js
const levels = require('<your level.js file path here>')
levels(client)
```

### Levelling Commands
---
##### Rank Command: To make your rank command, make a file called `rank.js` and add the following to it! For now, suppose the prefix is '!'
---
```js
const { levelling } = require('bacclib')
let target
if(message.mentions.members.first()) {
    target = message.mentions.members.first()
}else if(args[0]) {
    target = message.guild.members.cache.get(args[0])
} else {
    target = message.member
}

// the above code makes so if only !rank is typed, the rank of the author is going to be shown. If !rank <userid> is typed, it will show the rank of the member whose id is specified! If !rank @mention is typed, it will show rank of the member who has been mentioned!

const user = await levelling.fetchXp(target.id, message.guild.id)
const neededXp = levelling.xpFor(parseInt(user.level) + 1)
if(!user) {
    return message.channel.send('The mentioned user does\'t have any XP!')
}

message.channel.send(`The mentioned user has **${user.xp}** XP and **${user.level}** levels!\nThe mentioned member is currently requires **${neededXp}** XP to level up again!`)
```
##### - If you want to make a "Rank Card", then remove the bottom "message.channel.send" from your `rank.js` and replace it with the following code

##### Remember: You need a module named [Canvacord] to use this!
---
```sh
$npm install canvacord@latest
```

```js
const canvacord = require('canvacord')
const rank = new canvacord.Rank()
.setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
.setCurrentXP(user.xp)
.setLevel(user.level)
.setRequiredXP(neededXp)
.setStatus(target.presence.status)
.setProgressBar('#FFFFFF')
.setUsername(target.username)
.setDiscriminator(target.discriminator)
rank.build().then(data => {
    const attachment = new MessageAttachment(data, 'rank.png')
    message.channel.send(attachment)
    })
```

##### Add-Xp Command: Add the following to your `add-xp.js` (or whatever you had named it)
---
```js
const { levelling } = require('bacclib')
levelling.addXp('<id of the user you want to add xp of>', message.guild.id, '<amount of xp>')
// it is better to change the '<id of the user you want to add xp of>' to target.id [check previous code to see what target is] and '<amount of xp>' to args[1]
```

##### Add-Level Command: Add the following to your `add-level.js` (or whatever you had named it)
---
```js
const { levelling } = require('bacclib')
levelling.addLevel('<id of the user you want to add level of>', message.guild.id, '<amount of levels>')
// it is better to change the '<id of the user you want to add level of>' to target.id [check previous code to see what target is] and '<amount of levels>' to args[1]
```

##### Set-Xp Command: Add the following to your `set-xp.js` (or whatever you had named it)
---
```js
const { levelling } = require('bacclib')
levelling.setXp('<id of the user you want to set xp of>', message.guild.id, '<amount of xp>')
// it is better to change the '<id of the user you want to set xp of>' to target.id [check previous code to see what target is] and '<amount of xp>' to args[1]
```

##### Set-Levels Command: Add the following to your `set-level.js` (or whatever you had named it)
---
```js
const { levelling } = require('bacclib')
levelling.setLevel('<id of the user you want to set level of>', message.guild.id, '<amount of levels>')
// it is better to change the '<id of the user you want to set level of>' to target.id [check previous code to see what target is] and '<amount of levels>' to args[1]
```

##### Remove-Xp Command: Add the following to your `remove-xp.js` (or whatever you had named it)
---
```js
const { levelling } = require('bacclib')
levelling.subtractXp('<id of the user you want to remove xp of>', message.guild.id, '<amount of xp>')
// it is better to change the '<id of the user you want to remove xp of>' to target.id [check previous code to see what target is] and '<amount of xp>' to args[1]
```

##### Remove-Levels Command: Add the following to your `remove-level.js` (or whatever you had named it)
---
```js
const { levelling } = require('bacclib')
levelling.subtractLevel('<id of the user you want to remove levels of>', message.guild.id, '<amount of levels>')
// it is better to change the '<id of the user you want to remove levels of>' to target.id [check previous code to see what target is] and '<amount of levels>' to args[1]
```
### Economy System
##### - To start making an economy system for your bot, you need to make a file named `economy.js` (or any other file name you want)
---
```js
const { economy } = require('bacclib')
const a = 100 //or any number, this will make so everytime a member says something, the member will get a random amount of coins(or any other currency you want) between 1 and the number you specify here!
economy.setURL('<your mongodb url here>')
module.exports = async(client) => {
    client.on('message', async(message) => {
        if(!message.guild) return //will make so if you sent a message in dms, it wont give you coins!
        if(message.author.bot) return // will make so that any bot doesnt get coins!
        if(message.content.startsWith('<your bot prefix here>')) return //will make so bot doesnt give coins when using a command!
        
        const randomCoins = Math.floor(Math.random() * a) + 1
        await economy.addCoins(message.author.id, message.guild.id, randomCoins)
    })
}
```
##### - To enable the economy system, you just have to add the following in your index.js (or whatever your main file name is)
```js
const economy = require('<your economy.js file path here>')
economy(client)
```

### Economy Commands
---
##### Balance Command: To make your balance command, make a file called `bal.js` (or any other file name you want) and add the following to it!
---
```js
const { economy } = require('bacclib')
let target
if(message.mentions.members.first()) {
    target = message.mentions.members.first()
}else if(args[0]) {
    target = message.guild.members.cache.get(args[0])
} else {
    target = message.member
}

// the above code makes so if only !balance is typed, the balance of the author is going to be shown. If !balance <userid> is typed, it will show the balance of the member whose id is specified! If !balance @mention is typed, it will show balance of the member who has been mentioned!

const user = await economy.fetchCoins(target.id, message.guild.id)

message.channel.send(`**Balance of <@${user.userID}>:** <your coins emoji> ${user.coins}!`)
```
##### Add-Coins Command: Add the following to your `add-coins.js` (or whatever you had named it)
```js
const { economy } = require('bacclib')
economy.addCoins('<id of the user you want to add coins of>', message.guild.id, '<amount of coins>')
// it is better to change the '<id of the user you want to add coins of>' to target.id [check previous code to see what target is] and '<amount of coins>' to args[1]
```

##### Set-Coins Command: Add the following to your `set-coins.js` (or whatever you had named it)
```js
const { economy } = require('bacclib')
economy.setCoins('<id of the user you want to set coins of>', message.guild.id, '<amount of coins>')
// it is better to change the '<id of the user you want to set coins of>' to target.id [check previous code to see what target is] and '<amount of coins>' to args[1]
```

##### Remove-Coins Command: Add your the following to your `remove-coins.js` (or whatever you had named it)
```js
const { economy } = require('bacclib')
economy.subtractCoins('<id of the user you want to remove coins of>', message.guild.id, '<amount of coins>')
// it is better to change the '<id of the user you want to remove coins of>' to target.id [check previous code to see what target is] and '<amount of coins>' to args[1]
```

##### Pay Command: Add the following to your `pay.js`  (or whatever you had named it)
```js
const { economy } = require('bacclib')
economy.addCoins('<id of the user you want to pay coins to>', message.guild.id, '<amount of coins>')
economy.subtractCoins(message.author.id, message.guild.id, '<amount of coins>')
// it is better to change the '<id of the user you want to pay coins of>' to target.id [check previous code to see what target is] and '<amount of coins>' to args[1]
```
---
[Bacc]: <https://github.com/AaryanKhClasses/Bacc>
[Canvacord]: <https://www.npmjs.com/package/canvacord>
[Levelling]: <https://github.com/AaryanKhClasses/BaccLib#levelling-system>
[Economy]: <https://github.com/AaryanKhClasses/BaccLib#economy-system>
