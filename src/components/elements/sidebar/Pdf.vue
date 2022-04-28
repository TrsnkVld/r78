<template>
  <div></div>
</template>

<script>
var pdfMake = require("pdfmake/build/pdfmake.js");
var pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  data() {
    return {
      tableData: [],
      checkedRows: [],
      columns: ["selected", "sku"],
      options: {},
    };
  },
  methods: {
    createPDF() {
      var docDefinition = {
        content: [
          {
            table: {
              headerRows: 1,
              widths: ["*", "auto", 100, "*"],
              body: [],
            },
          },
        ],
      };
      docDefinition.content[0].table.body.push(this.columns);
      for (var i = 0; i < this.checkedRows.length; i++) {
        docDefinition.content[0].table.body.push(
          Object.values(this.checkedRows[i])
        );
      }
      pdfMake.createPdf(docDefinition).download("PO.pdf");
    },
  },
};
