# 3D Models for MeSnap.App

This directory contains the 3D models used for the interactive product viewer.

## Required Files

Place the following `.glb` files in this directory:

1. `mesnap.glb` - The MeSnap ID card holder model
2. `iphone16.glb` - The iPhone model for the phone view

## Model Requirements

### MeSnap Model

- The default color of the model should be yellow
- The model should include a material named "body" (or whatever you've defined in the JSON configuration) that will be changed when the user selects different colors
- The model should be oriented appropriately for viewing (default position and rotation)

### iPhone Model

- The model should be oriented and positioned to work well with the MeSnap model when attached
- Position and scale can be adjusted in the product data JSON

## Configuration

The positioning, scale, and rotation of these models can be configured in the `data/products.json` file under the `modelPositioning` property. This allows for easy adjustments without changing the actual model files.

Example configuration:

```json
"modelPositioning": {
  "mesnap": {
    "scale": 1,
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0}
  },
  "phone": {
    "scale": 1,
    "position": {"x": 0, "y": 0, "z": -0.1},
    "rotation": {"x": 0, "y": 0, "z": 0}
  },
  "colorMaterial": "body"
}
```

## Troubleshooting

If the models don't appear or appear incorrectly:

1. Check the browser console for loading errors
2. Verify that the model files are correctly placed in this directory
3. Make sure the material names in the models match what's expected in the code
4. Adjust the positioning values in the JSON configuration

## Model Creation

The models should be created in a 3D modeling software like Blender, exported as `.glb` format with these specifications:

- Optimized mesh with reasonable polygon count
- Simple PBR materials 
- Proper UV mapping
- Centered origin point
- Forward-facing orientation (Z-axis forward)
- Proper scale (real-world dimensions)