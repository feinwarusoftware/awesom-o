"use strict";

const crypto = require("crypto");
const axios = require("axios");
const express = require("express");
const router = express.Router();

/* TEMP */

const showdown = require("showdown");
const converter = new showdown.Converter();

/*
const fs = require("fs");
const path = require("path");

const commandsfile = fs.readFileSync(path.join(__dirname, "..", "translations", "commands", "commands.json"));
const commands = JSON.parse(commandsfile);
*/

const getUserData = async token => {

    return new Promise((resolve, reject) => {

        axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {

            res.data.time = Date.now();
            resolve(res.data);
        }).catch(err => {

            reject(err);
        });
    });
}

router.get("/",  async (req, res) => {

    if (req.session.discord_login !== null && req.session.discord_login !== undefined) {
        
        if (req.session.userData === null || req.session.userData === undefined || (Date.now() - req.session.userData.time) / 1000 > 300) {

            req.session.userData = await getUserData(req.session.discord_login.access_token);
            if (req.session.userData === null) {

                res.status(500).send("Error getting user info.");
                return;
            }
        }

        res.render("index", { md: text => { return converter.makeHtml(text); }, user: req.session.userData });

    } else {

        res.render("index", { md: text => { return converter.makeHtml(text); }, user: null });
    }
});

// /commands

router.get("/commands", async (req, res) => {

    if (req.session.discord_login !== null && req.session.discord_login !== undefined) {
        
        if (req.session.userData === null || req.session.userData === undefined || (Date.now() - req.session.userData.time) / 1000 > 300) {

            req.session.userData = await getUserData(req.session.discord_login.access_token);
            if (req.session.userData === null) {

                res.status(500).send("Error getting user info.");
                return;
            }
        }

        res.render("commands", { md: text => { return converter.makeHtml(text); }, user: req.session.userData});

    } else {

        res.render("commands", { md: text => { return converter.makeHtml(text); }, user: null});
    }
});

// /dashboard

router.get("/dashboard/profiles/mattheous", (req, res) => {
    return res.render("profile-admin", { md: text => { return converter.makeHtml(text); } });
});

/* -------------------------- */
/* >>> DISCORD LOGIN SHIT <<< */
/* -------------------------- */

router.get("/auth/discord", (req, res) => {

    const state = crypto.randomBytes(20).toString("hex");

    req.session.nonce = state;

    res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=372462428690055169&redirect_uri=http%3A%2F%2F81.156.215.77%3A80%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=guilds%20identify&state="+state);
    return;
});

router.get("/auth/discord/callback", (req, res) => {

    if (req.session.nonce === null || req.session.nonce === undefined) {
        res.status(500).send("Error logging in.");
        return;
    }

    if (req.query.code === null || req.query.code === undefined) {
        res.status(500).send("Error logging in.");
        return;
    }

    if (req.session.nonce !== req.query.state) {
        res.status(500).send("Error logging in.");
        return;
    }

    req.session.nonce = null;

    axios({
        method: "post",
        url: "https://discordapp.com/api/oauth2/token?client_id=372462428690055169&client_secret=e-GgLn0Ndv9LJc1jupdpsk1zNGPy4g4U&grant_type=authorization_code&code="+req.query.code+"&redirect_uri=http%3A%2F%2F81.156.215.77%3A80%2Fauth%2Fdiscord%2Fcallback",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(res2 => {

        req.session.discord_login = res2.data;
        res.redirect("/dashboard");
        return;
    }).catch(err => {

        res.status(500).send("Error logging in.");
        return;
    });
});

/*
router.get("/auth/discord/me", (req, res) => {
    
    if (!req.session.token.access_token) {
        return res.status(500).send("Error logging in.");
    }
    axios({
        method: "get",
        url: "https://discordapp.com/api/v6/users/@me",
        headers: {
            "Authorization": "Bearer "+req.session.token.access_token
        }
    }).then(res2 => {
        req.session.user = res2.data;
        return res.redirect("/");
    }).catch(err => {
        return res.status(500).send("Error logging in.");
    });
});
*/

/* -------------------------- */
/*        >>> END <<<         */
/* -------------------------- */

module.exports = router;
