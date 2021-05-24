const mongoose = require('mongoose')
const levelModel = require('../models/levelModel')
var mongoUrl

class levelling {
    /**
    * @param {string} [dbUrl] - A valid MongoDB Database URL
    */

    static async setURL(dbUrl) {
        if(!dbUrl) throw new TypeError("A database URL was not provided or the URL Provided is invalid!")
        mongoUrl = dbUrl
        return mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    }

    // levelling commands start here

    /**
    * @param {string} [userID] - ID of the discord user!
    * @param {string} [guildID] - ID of the discord guild!
    * @param {number} [xp] - Amount of XP to add!
    */

    static async addXp(userID, guildID, xp) {
        if(!userID) throw new TypeError("A User ID wasn't provided while adding XP")
        if(!guildID) throw new TypeError("A Guild ID wasn't provided while adding XP")
        if(!xp || xp == 0 || isNaN(parseInt(xp))) throw new TypeError("An amount of XP wasn't specified or was invalid!")

        const user = await levelModel.findOne({ userID: userID, guildID: guildID })
        if(!user) {
            const newUser = new levelModel({
                userID: userID,
                guildID: guildID,
                xp: xp,
                level: Math.floor(0.1 * Math.sqrt(xp))
            })

            await newUser.save().catch(e => console.log('Failed to save the new user!'))
            return (Math.floor(0.1 * Math.sqrt(xp)) > 0)
        }
        user.xp += parseInt(xp, 10)
        user.level = Math.floor(0.1 * Math.sqrt(user.xp))
        user.lastUpdated = new Date()
    
        await user.save().catch(e => console.log(`Failed to add XP: ${e}`) )
        return (Math.floor(0.1 * Math.sqrt(user.xp -= xp)) < user.level)
    }

    /**
    * @param {string} [userID] - ID of the discord user!
    * @param {string} [guildID] - ID of the discord guild!
    * @param {number} [levels] - Amount of levels to add!
    */

    static async addLevel(userID, guildID, levels) {
        if(!userID) throw new TypeError("A User ID wasn't provided while adding levels")
        if(!guildID) throw new TypeError("A Guild ID wasn't provided while adding levels")
        if(!levels || levels == 0 || isNaN(parseInt(levels))) throw new TypeError("An amount of levels wasn't specified or was invalid!")

        const user = await levelModel.findOne({ userID: userID, guildID: guildID })
        if (!user) return false
        
        user.level += parseInt(levels, 10)
        user.xp = user.level * user.level * 100
        user.lastUpdated = new Date()
    
        user.save().catch(e => console.log(`Failed to add level: ${e}`) )
        return user
    }

    /**
    * @param {string} [userID] - ID of the discord user!
    * @param {string} [guildID] - ID of the discord guild!
    * @param {number} [xp] - Amount of XP to set!
    */

    static async setXp(userID, guildID, xp) {
        if(!userID) throw new TypeError("A User ID wasn't provided while setting XP")
        if(!guildID) throw new TypeError("A Guild ID wasn't provided while setting XP")
        if(!xp || xp == 0 || isNaN(parseInt(xp))) throw new TypeError("An amount of XP wasn't specified or was invalid!")

        const user = await levelModel.findOne({ userID: userID, guildID: guildID })
        if (!user) return false

        user.xp = xp
        user.level = Math.floor(0.1 * Math.sqrt(user.xp))
        user.lastUpdated = new Date()

        user.save().catch(e => console.log(`Failed to set xp: ${e}`) )
        return user
    }

    /**
    * @param {string} [userID] - ID of the discord user!
    * @param {string} [guildID] - ID of the discord guild!
    * @param {number} [levels] - Amount of levels to set!
    */

    static async setLevel(userID, guildID, levels) {
        if(!userID) throw new TypeError("A User ID wasn't provided while setting levels")
        if(!guildID) throw new TypeError("A Guild ID wasn't provided while setting levels")
        if(!levels || levels == 0 || isNaN(parseInt(levels))) throw new TypeError("An amount of levels wasn't specified or was invalid!")

        const user = await levelModel.findOne({ userID: userID, guildID: guildID })
        if (!user) return false

        user.levels = levels
        user.xp = levels * levels * 100
        user.lastUpdated = new Date()

        user.save().catch(e => console.log(`Failed to set level: ${e}`) )
        return user
    }

    /**
    * @param {string} [userID] - ID of the discord user!
    * @param {string} [guildID] - ID of the discord guild!
    */

    static async fetchXp(userID, guildID, fetchPosition = false) {
        if(!userID) throw new TypeError("A User ID wasn't provided while fetching XP")
        if(!guildID) throw new TypeError("A Guild ID wasn't provided while fetching XP")

        const user = await levelModel.findOne({
            userID: userID,
            guildID: guildID
        })
        if (!user) return false

        if (fetchPosition === true) {
        const leaderboard = await levelModel.find({
            guildID: guildID
        }).sort([['xp', 'descending']]).exec()

        user.position = leaderboard.findIndex(i => i.userID === userID) + 1
        }
        /* To be used with canvacord or displaying xp in a pretier fashion, with each level the cleanXp stats from 0 and goes until cleanNextLevelXp when user levels up and gets back to 0 then the cleanNextLevelXp is re-calculated */
        user.cleanXp = user.xp - this.xpFor(user.level)
        user.cleanNextLevelXp = this.xpFor(user.level + 1) - this.xpFor(user.level)
        
        return user
    }

    /**
    * @param {string} [userID] - ID of the discord user!
    * @param {string} [guildID] - ID of the discord guild!
    * @param {number} [xp] - Amount of XP to subtract!
    */

    static async subtractXp(userID, guildID, xp) {
        if (!userID) throw new TypeError("An user id was not provided while subtracting XP.")
        if (!guildID) throw new TypeError("A guild id was not provided while subtracting XP.")
        if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of XP was not provided or was invalid.")

        const user = await levelModel.findOne({ userID: userID, guildID: guildID })
        if (!user) return false

        user.xp -= xp
        user.level = Math.floor(0.1 * Math.sqrt(user.xp))
        user.lastUpdated = new Date()
    
        user.save().catch(e => console.log(`Failed to subtract xp: ${e}`) )
        return user
    }

    /**
    * @param {string} [userID] - ID of the discord user!
    * @param {string} [guildID] - ID of the discord guild!
    * @param {number} [levels] - Amount of levels to subtract!
    */

    static async subtractLevel(userID, guildID, levels) {
        if (!userID) throw new TypeError("An user id was not provided while subtracting levels.")
        if (!guildID) throw new TypeError("A guild id was not provided while subtracting levels.")
        if (levels == 0 || !levels || isNaN(parseInt(levels))) throw new TypeError("An amount of levels was not provided or was invalid.")
        const user = await levelModel.findOne({ userID: userID, guildID: guildID })
        if (!user) return false

        user.level -= levels
        user.xp = user.level * user.level * 100
        user.lastUpdated = new Date()
        
        user.save().catch(e => console.log(`Failed to subtract levels: ${e}`) )
        return user
    }

    /**
    * @param {string} [guildID] - ID of the discord guild!.
    * @param {number} [limit] - Amount of maximum enteries to return!
    */

    static async fetchXpLeaderboard(guildID, limit) {
        if (!guildID) throw new TypeError("A guild id was not provided while fetching leaderboard.")
        if (limit == 0 || !limit || isNaN(parseInt(limit))) throw new TypeError("An amount of limit was not provided or was invalid.")

        var users = await levelModel.find({ guildID: guildID }).sort([['xp', 'descending']]).exec()
        return users.slice(0, limit)
    }

    /**
    * @param {string} [client] - Your Discord.Client.
    * @param {array} [leaderboard] - The output from 'fetchXpLeaderboard' function.
    */

    static async computeXpLeaderboard(client, leaderboard, fetchUsers = false) {
        if (!client) throw new TypeError("A client was not provided while computing leaderboard.")
        if (!leaderboard) throw new TypeError("A leaderboard id was not provided.")

        if (leaderboard.length < 1) return []

        const computedArray = []

        if (fetchUsers) {
        for (const key of leaderboard) {
            const user = await client.users.fetch(key.userID) || { username: "Unknown", discriminator: "0000" }
            computedArray.push({
            guildID: key.guildID,
            userID: key.userID,
            xp: key.xp,
            level: key.level,
            position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
            username: user.username,
            discriminator: user.discriminator
            })
        }
        } else {
        leaderboard.map(key => computedArray.push({
            guildID: key.guildID,
            userID: key.userID,
            xp: key.xp,
            level: key.level,
            position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
            username: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : "Unknown",
            discriminator: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : "0000"
        }))
        }

        return computedArray
    }
    
    /**
    * @param {number} [targetLevel] - Xp required to reach that level.
    */
    static xpFor (targetLevel) {
        if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10))) throw new TypeError("Target level should be a valid number.")
        if (isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10)
        if (targetLevel < 0) throw new RangeError("Target level should be a positive number.")
        return targetLevel * targetLevel * 100
    }
}
module.exports = levelling
