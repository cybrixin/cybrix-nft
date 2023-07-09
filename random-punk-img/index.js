import { resolve, dirname, join } from 'node:path';
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer';

import sharp from 'sharp';
import md5 from 'js-md5';

const fileUrl = fileURLToPath(import.meta.url);
const __filename = resolve(fileUrl);
const __dirname = dirname(__filename);
global.appRoot = resolve(__dirname);

const takenNames = {};
const takenHashes = {};

const MAX_RETRY = 100;
const BASE_PATH = join(__dirname, 'out');

const BG = ["#ff4d4d", "#4dff5e", "#ffed4d", "#bb4dff", "#ff8d4d", "#4ddfff", "#b6e3f4", "#c0aede", "#d1d4f9", "#ffd5dc", "#ffdfbf"];

const FACIAL_TYPE = [
    {
        type: "scruff",
        rarity: 0.4
    },
    {
        type: "beard",
        rarity: 0.5
    }
]

const EARS_TYPE = [{
    type: "detached",
    rarity: 0.5
}, {
    type: "attached",
    rarity: 0.5
}];

const EARRING_TYPE = [
    {
        rarity: 0.1,
        type: 'hoop'
    }, 
    {
        rarity: 0.9,
        type: 'stud'
    }
];

const EARRING_COLOR = [ {
    color: "#000000", 
    rarity: 0.2
}, {
    color: "#6bd9e9", 
    rarity: 0.92
}, {
    color: "#9287ff", 
    rarity: 0.85
}, {
    color: "#77311d", 
    rarity: 0.52
}, {
    color: "#ac6651", 
    rarity: 0.2
}, {
    color: "#d2eff3", 
    rarity: 0.88
}, {
    color: "#e0ddff", 
    rarity: 0.93
}, {
    color: "#f4d150", 
    rarity: 0.95
}, {
    color: "#f9c9b6", 
    rarity: 0.92
}, {
    color: "#fc909f", 
    rarity: 0.72
}, {
    color: "#ffeba4", 
    rarity: 0.88
}, {
    color: "#ffedef", 
    rarity: 0.85
}, {
    color: "#ffffff", 
    rarity: 0.2
}
];

const MOUTH_TYPE = [
    { 
        type: "frown",
        rarity: 0.9
    }, 
    { 
        type: "laughing",
        rarity: 0.2
    }, 
    { 
        type: "nervous",
        rarity: 0.6
    }, 
    { 
        type: "pucker",
        rarity: 0.4
    }, 
    { 
        type: "sad",
        rarity: 0.3
    }, 
    { 
        type: "smile",
        rarity: 0.8
    }, 
    { 
        type: "smirk",
        rarity: 0.7
    }, 
    { 
        type: "surprised",
        rarity: 0.9
    }
];

const NOSE_TYPE = [
    {
        type: "pointed",
        rarity: 0.3
    },
    {
        type: "curve",
        rarity: 0.6,
    },
    {
        type: "tound",
        rarity: 0.9
    }
]

const EYEBROW_TYPE = [
    {
        rarity: 0.2,
        type: 'down',
    },
    {
        type: 'eyelashesDown', 
        rarity: 0.4
    },
    {
        type: 'eyelashesUp', 
        rarity: 0.6
    },
    {
        type: 'up',
        rarity: 0.8
    }
];

const EYES_TYPE = [
    {
        type: "eyes",
        rarity: 0.1
    }, 
    {
        type: "eyesShadow",
        rarity: 0.3
    }, 
    { 
        type: "round",
        rarity: 0.5
    }, 
    {
        type: "smiling",
        rarity: 0.7
    },
    {
        type: "smilingShadow",
        rarity: 0.9
    },
];

const EYES_COLOR = [{
    color: "#000000", 
    rarity: 0.01
}, {
    color: "#6bd9e9", 
    rarity: 0.90
}, {
    color: "#9287ff", 
    rarity: 0.92
}, {
    color: "#77311d", 
    rarity: 0.93
}, {
    color: "#ac6651", 
    rarity: 0.94
}, {
    color: "#f4d150", 
    rarity: 0.97
}, {
    color: "#f9c9b6", 
    rarity: 0.98
}, {
    color: "#fc909f", 
    rarity: 0.99
}, {
    color: "#ffeba4", 
    rarity: 0.91
}
]

const HAIR_TYPE = [
    {
        rarity: 0.1,
        type: "dannyPhantom",
    },
    {
        rarity: 0.2,
        type: "dougFunny",
    },
    {
        rarity: 0.3,
        type: "fonze",
    },
    {
        rarity: 0.4 ,
        type: "full",
    },
    {
        rarity: 0.5,
        type: "mrClean",
    },
    {
        rarity: 0.6,
        type: "mrT",
    },
    {
        rarity: 0.7 ,
        type: "pixie",
    },
    {
        rarity: 0.8,
        type: "turban",
    }
];

const HAIR_COLOR = [ {
        color: "#000000", 
        rarity: 0.2
    }, {
        color: "#6bd9e9", 
        rarity: 0.92
    }, {
        color: "#9287ff", 
        rarity: 0.85
    }, {
        color: "#77311d", 
        rarity: 0.52
    }, {
        color: "#ac6651", 
        rarity: 0.2
    }, {
        color: "#d2eff3", 
        rarity: 0.88
    }, {
        color: "#e0ddff", 
        rarity: 0.93
    }, {
        color: "#f4d150", 
        rarity: 0.95
    }, {
        color: "#f9c9b6", 
        rarity: 0.92
    }, {
        color: "#fc909f", 
        rarity: 0.72
    }, {
        color: "#ffeba4", 
        rarity: 0.88
    }, {
        color: "#ffedef", 
        rarity: 0.85
    }, {
        color: "#ffffff", 
        rarity: 0.2
    }
];

const GLASS_TYPE = [
    {
        type: "round",
        rarity: 0.1
    }, { 
        type: "squared",
        rarity: 0.9
    }
];

const GLASS_COLOR = [{
        color: "#000000", 
        rarity: 0.2
    }, {
        color: "#6bd9e9", 
        rarity: 0.5
    }, {
        color: "#9287ff", 
        rarity: 0.48
    }, {
        color: "#77311d", 
        rarity: 0.93
    }, {
        color: "#ac6651", 
        rarity: 0.84
    }, {
        color: "#d2eff3", 
        rarity: 0.65
    }, {
        color: "#e0ddff", 
        rarity: 0.75
    }, {
        color: "#f4d150", 
        rarity: 0.99
    }, {
        color: "#f9c9b6", 
        rarity: 0.98
    }, {
        color: "#fc909f", 
        rarity: 0.55
    }, {
        color: "#ffeba4", 
        rarity: 0.64
    }, {
        color: "#ffedef", 
        rarity: 0.82
    }, {
        color: "#ffffff", 
        rarity: 0.2
    }
];

const SHIRT_TYPE = [
    {
        type: "collared",
        rarity: 0.1
    }, 
    {
        type: "crew",
        rarity: 0.5
    }, 
    {
        type: "open",
        rarity: 0.9
    }
];

const SHIRT_COLOR = [{
    color: "#000000", 
    rarity: 0.1
}, {
    color: "#6bd9e9", 
    rarity: 0.5
}, {
    color: "#9287ff", 
    rarity: 0.48
}, {
    color: "#77311d", 
    rarity: 0.93
}, {
    color: "#ac6651", 
    rarity: 0.84
}, {
    color: "#d2eff3", 
    rarity: 0.65
}, {
    color: "#e0ddff", 
    rarity: 0.75
}, {
    color: "#f4d150", 
    rarity: 0.99
}, {
    color: "#f9c9b6", 
    rarity: 0.98
}, {
    color: "#fc909f", 
    rarity: 0.55
}, {
    color: "#ffeba4", 
    rarity: 0.64
}, {
    color: "#ffedef", 
    rarity: 0.82
}, {
    color: "#ffffff", 
    rarity: 0.2
}
]

const CHARACTER = {
    "facialHair": {
        accepted: (score) => score >= 51,
        color: undefined,
        type: FACIAL_TYPE,
        probability: "facialHairProbability"
    },
    "ears": {
        accepted: (score) => true,
        color: undefined,
        type: EARS_TYPE,
        probability: undefined
    },
    "earrings": {
        accepted: (score) => score >= 30,
        color: {
            array: EARRING_COLOR,
            param: "earringColor",
        },
        type: EARRING_TYPE,
        probability: "earringsProbability"
    },
    "mouth": {
        accepted: (score) => true,
        color: undefined,
        type: MOUTH_TYPE,
        probability: undefined
    },
    "nose": {
        accepted: (score) => true,
        color: undefined,
        type: NOSE_TYPE,
        probability: undefined
    },
    "shirt": {
        accepted: (score) => true,
        color: {
            array: SHIRT_COLOR,
            param: "shirtColor"
        },
        type: SHIRT_TYPE,
        probability: undefined
    },
    "hair": {
        accepted: (score) => score > 5,
        color: {
            array: HAIR_COLOR,
            param: "hairColor"
        },
        type: HAIR_TYPE,
        probability: "hairProbability"
    },
    "glasses": {
        accepted: (score) => score > 60,
        color: {
            param: "glassesColor",
            array: GLASS_COLOR
        },
        type: GLASS_TYPE,
        probability: "glassesProbability"
    },
    "eyebrows": {
        accepted: (score) => true,
        color: undefined,
        type: EYEBROW_TYPE,
        probability: undefined,
    },
    "eyes": {
        accepted: (score) => true,
        color: {
            param: "eyesColor",
            array: EYES_COLOR
        },
        type: EYES_TYPE,
        probability: undefined
    }
}

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function arrToString(arr = [], concat = "|") {
    return Array.isArray(arr) ? arr.map( value => value.toString() ).join(concat) : undefined;
}

function hashString(str) {
    if(typeof str === 'string' && str.trim().length > 0) {
        return md5(str); 
    }

    throw new Error(`Non empty String expected`)
}

function getRandomName() {
    let adjectives = 'fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical'.split(' ');
    const names = 'aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis'.split(' ');
    
    const randAdj = randElement(adjectives);
    const randName = randElement(names);
    const name =  `${randAdj}-${randName}`;


    if (takenNames[name] || !name) {
        return getRandomName();
    } else {
        takenNames[name] = name;
        return name;
    }
}

function buildCharacter({ seed, backgroundColor }) {

    const myCharacterTraits = [seed, backgroundColor];

    const myCharacter = {
        seed, 
        backgroundColor: backgroundColor.substring(1)
    };

    let rarity = 0;
    let counter = 0;

    
    for(let [ key, value ] of Object.entries(CHARACTER)) {
        
        const probability = randInt(100);

        const { accepted, color, type, probability: probabilityParam  } = value;


        if(accepted(probability)) {

            counter++;
            let propRarity = 0;

            const { type: typeName, rarity: typeRarity } = randElement(type);

            myCharacter[key] = typeName
            myCharacterTraits.push(key, typeName);
            

            propRarity += (probability / 100 ) * typeRarity;
            
            if(typeof color !== 'undefined') {
                
                // console.log(color);

                const { param: colorParam, array: colorArr } = color;

                const { color: shade, rarity: colorRarity } = randElement(colorArr);

                propRarity += (probability / 100 ) * colorRarity;

                myCharacter[colorParam] = shade.substring(1);

                myCharacterTraits.push(colorParam, shade);

                propRarity /= 2.0;
            }

            if(typeof probabilityParam !== 'undefined') {
                myCharacter[probabilityParam] = probability

                myCharacterTraits.push(probabilityParam, probability);
            }

            myCharacter[`${key}-rarity`] = Number(propRarity.toFixed(1))

            rarity += propRarity;
        }
    }

    rarity = Number((rarity / counter).toFixed(1))

    const hash = arrToString(myCharacterTraits, '|');

    return {
        character: myCharacter,
        rarity,
        hashString: hashString(hash),
    }

}

function fileWrite(filePath, options, body) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath, options);
      file.write(body);
      file.end();
      file.on("finish", () => { resolve(true); }); // not sure why you want to pass a boolean
      file.on("error", reject); // don't forget this!
    });
}

async function getRandomAvatar(idx = 0, retry = 0) {
    
    if(retry === MAX_RETRY) {
        throw new Error("No more random avatars could be generated");
    }

    const opts = buildCharacter({
        seed: getRandomName(),
        backgroundColor: randElement(BG)
    });

    const { character, rarity, hashString } = opts;


    if(typeof takenHashes[hashString] !== 'undefined') {
        return await getRandomAvatar(idx, ++retry)
    }

    const url = new URL('https://api.dicebear.com/6.x/micah/svg');

    const searchParams = url.searchParams;

    const attributes = [];
    const blackList = [];

    for( const [key, value] of Object.entries(character) ) {
        if(blackList.includes(key)) continue;

        if(`${key}-rarity` in character) {
            blackList.push(`${key}-rarity`)
            
            attributes.push({
                [key]: true,
                rarity: character[`${key}-rarity`]
            })

            delete character[`${key}-rarity`];
        }
        searchParams.set(key, value);
    }

    const meta = {
        name: character.seed,
        description: `A drawing of ${character.seed.split('-').join(' ')}`,
        image: `${idx}.png`,
        attributes: [...attributes, {
            hash: hashString,
            rarity,
        }]
    }

    const metaBuffer = Buffer.from(JSON.stringify(meta));

    const avatar = await fetch(url.toString());

    if(!avatar.ok) {
        // Scrap here, try again
        // before doing pop the name from takenNames
        delete takenNames[character.seed];

        return await getRandomAvatar(idx, ++retry);
    }

    takenHashes[hashString] = hashString;

    const buffer = await avatar.arrayBuffer();

    const data = Buffer.from(buffer);

    const outPath = {
        svg: join(BASE_PATH, `${idx}.svg`),
        png: join(BASE_PATH, `${idx}.png`),
        json: join(BASE_PATH, `${idx}.json`),
    }

    const fsOpts = {
        autoClose: true,
        flags: 'w'
    };


    const [svgRes, pngRes, jsonRes] = await Promise.all([await fileWrite(outPath.svg, fsOpts, data), sharp(data).png().toFile(outPath.png), await fileWrite(outPath.json, fsOpts, metaBuffer)]);

    return [svgRes, pngRes, jsonRes];
}

if(fs.existsSync(BASE_PATH) === false) {
    // MKDIR
    fs.mkdirSync(BASE_PATH);
}
else {

    fs.readdirSync(BASE_PATH).forEach( f => {
        f = join(BASE_PATH, f);
        fs.rmSync(f)
    })
}


let idx = 33;
const MAX = idx;

const jobs = [];

do {
    idx--;
    jobs.push(getRandomAvatar(MAX - idx, 0));
}while(idx > 0)

Promise.all(jobs).then((reponses) => {
    reponses.forEach( (response) => {
        console.log(response);
    })
});