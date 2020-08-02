const accessories = require('./../data/accessories');
const clothes = require('./../data/clothes');
const clothesColor = require('./../data/clothesColor');
const clothesGraphic = require('./../data/clothesGraphic');
const eyebrows = require('./../data/eyebrow');
const eyes = require('./../data/eyes');
const facialHair = require('./../data/facialHair');
const facialHairColors = require('./../data/facialHairColor');
const hairColors = require('./../data/hairColor');
const hatColors = require('./../data/hatColor');
const mouth = require('./../data/mouth');
const skin = require('./../data/skin');
const top = require('./../data/top');

const getRandom = (length) => {
  return Math.floor(Math.random() * length)
};

const generateRandomAvatar = (avatarType) => {
  const accessory = accessories[getRandom(accessories.length)];
  const facialHairStyle = facialHair[getRandom(facialHair.length)];
  const facialHairColor = facialHairColors[getRandom(facialHairColors.length)];
  const hatColor = hatColors[getRandom(hatColors.length)];
  const hairColor = hairColors[getRandom(hairColors.length)];
  const clothingColor = clothesColor[getRandom(clothesColor.length)];
  const clothingGraphic = clothesGraphic[getRandom(clothesGraphic.length)];
  const clothing = clothes[getRandom(clothes.length)];
  const eyebrow = eyebrows[getRandom(eyebrows.length)];
  const eyesStyle = eyes[getRandom(eyes.length)];
  const mouthStyle = mouth[getRandom(mouth.length)];
  const skinStyle = skin[getRandom(skin.length)];
  const topStyle = top[getRandom(top.length)];

  let avatarStyle = 'Transparent';
  if (Math.floor(Math.random() * 2) === 1) {
    avatarStyle = 'Circle'
  }
  let avatarOption = {
    avatarStyle: avatarType || avatarStyle,
    topType: topStyle,
    accessoriesType: accessory,
    hairColor: hairColor,
    hatColor: hatColor,
    facialHairType: facialHairStyle,
    facialHairColor: facialHairColor,
    clotheType: clothing,
    clotheColor: clothingColor,
    graphicType: clothingGraphic,
    eyeType: eyesStyle,
    eyebrowType: eyebrow,
    mouthType: mouthStyle,
    skinColor: skinStyle
  };

  return avatarOption;
  // return `https://avataaars.io/?avatarStyle=${avatarType || avatarStyle}&topType=${topStyle}&accessoriesType=${accessory}&hairColor=${hairColor}&hatColor=${hatColor}&facialHairType=${facialHairStyle}&facialHairColor=${facialHairColor}&clotheType=${clothing}&clotheColor=${clothingColor}&graphicType=${clothingGraphic}&eyeType=${eyesStyle}&eyebrowType=${eyebrow}&mouthType=${mouthStyle}&skinColor=${skinStyle}`
};

module.exports = { generateRandomAvatar }
