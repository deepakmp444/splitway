const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 1024x1024 canvas
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, 1024, 1024);

// Add app name
ctx.fillStyle = '#2563eb'; // Primary blue color
ctx.font = 'bold 120px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Splitway', 512, 512);

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../assets/splash.png'), buffer); 