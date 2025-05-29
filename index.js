const core = require("@actions/core")
const github = require("@actions/github")
const mustache = require("mustache")
const fs = require("fs")

const MUSTACHE_PATH = "./main.mustache"

const year = new Date().getFullYear()
const yearStart = new Date(`${year}-01-01T00:00:00+00:00`).getTime()
const yearEnd = new Date(`${year}-12-31T23:59:59+00:00`).getTime()
const yearProgress = (Date.now() - yearStart) / (yearEnd - yearStart)

function generateProgressBar() {
    const progressBarCapacity = 30
    const progressBarIndex = parseInt(yearProgress * progressBarCapacity)
    
    const progressBar = 
        "⣿".repeat(progressBarIndex) +
        "⣀".repeat(progressBarCapacity - progressBarIndex)

    return `⏳ Year progress [ ${progressBar} ] **${(yearProgress * 100).toFixed(2)}%**`
}

try {
    core.notice("Starting")

    fs.readFile(MUSTACHE_PATH, (err, data) => {
        if (err) throw err;

        const out = mustache.render(data.toString(), {
            progressBar: generateProgressBar(),
            time: new Date().toUTCString(),
        })

        fs.writeFileSync("README.md", out)
    })
} catch (err) {
    core.setFailed(err.message)
} 
