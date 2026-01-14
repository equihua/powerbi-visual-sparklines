/* eslint-disable powerbi-visuals/non-literal-fs-path */
const fs = require("fs");
const path = require("path");

const basePath = __dirname;
const capabilitiesPath = path.resolve(basePath, "../../capabilities.json");

// Orden específico de archivos para mantener la estructura correcta del capabilities.json
const fileOrder = [
  "general.json",
  "columnHeaders.json",
  "values.json",
  "totals.json",
  "specificColumn.json",
  "cellElements.json",
  "grid.json",
  "sparkline.json",
];

// Construir el objeto objects en el orden correcto
const objects = {};

for (const fileName of fileOrder) {
  const filePath = path.join(basePath, fileName);
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const json = JSON.parse(fileContent);
      // Agregar cada propiedad del JSON al objeto objects
      Object.keys(json).forEach((key) => {
        objects[key] = json[key];
      });
    } catch (error) {
      console.warn(`⚠️ Error al leer ${fileName}:`, error.message);
    }
  } else {
    console.warn(`⚠️ Archivo no encontrado: ${fileName}`);
  }
}

const capabilities = {
  dataRoles: [
    { displayName: "Category", name: "mainCategory", kind: "Grouping" },
    { displayName: "Measure Data", name: "measure", kind: "Measure" },
    { displayName: "Minigraph Axis", name: "axis", kind: "Grouping" },
    { displayName: "Minigraph Data", name: "sparkline", kind: "Measure" },
  ],
  dataViewMappings: [
    {
      categorical: {
        categories: {
          for: {
            in: "mainCategory",
          },
        },
        values: {
          group: {
            by: "axis",
            select: [
              {
                bind: {
                  to: "measure",
                },
              },
              {
                bind: {
                  to: "sparkline",
                },
              },
            ],
          },
        },
        dataVolume: 2,
      },
      conditions: [
        {
          mainCategory: {
            max: 1,
          },
          axis: {
            max: 1,
          },
          measure: {
            max: 10,
          },
          sparkline: {
            max: 5,
          },
        },
      ],
    },
  ],
  objects,
  sorting: {
    implicit: { clauses: [{ role: "mainCategory", direction: 1 }] },
  },
  supportsLandingPage: true,
  supportsEmptyDataView: false,
  suppressDefaultTitle: true,
  supportsHighlight: true,
  supportsMultiVisualSelection: true,
  tooltips: { supportedTypes: { default: true } },
  privileges: [],
};

fs.writeFileSync(capabilitiesPath, JSON.stringify(capabilities, null, 4));
console.log("✅ capabilities.json generado correctamente");
