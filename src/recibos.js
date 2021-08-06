import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import jquery from "jquery";
import DropDown from "./select.js";
import { DataGrid } from "@material-ui/data-grid";

const Facturapi = require("facturapi");
const facturapi = new Facturapi("sk_test_VN9W1bQmxaKq2e4j6x81ry870rkwYEXe");
var folio;
var lista = {
  recibos: []
};
async function recibo() {
  const searchResult = await facturapi.receipts.list();
  var doubles = searchResult.data.map(function (x) {
    folio = JSON.stringify(x.folio_number);
    var id = JSON.stringify(x.id);
    var total = JSON.stringify(x.total);
    var status = JSON.stringify(x.status);
    var at = JSON.stringify(x.created_at);

    //agregar aqui los campos para las columnas
    var newCon = {
      folio: folio,
      id: id,
      total: total,
      status: status,
      at: at
    };
    lista.recibos.push(newCon);
  });

  console.log(lista.recibos);
}
recibo();
async function global() {
  const invoice = await facturapi.receipts.createGlobalInvoice({
    from: "2021-07-28T22:44:26.093Z",
    to: "2021-07-28T22:45:23.182Z"
  });
}
const columns = [
  { field: "folio", headerName: "folio", width: 150 },
  { field: "total", headerName: "total", width: 150 },
  { field: "id", headerName: "id", width: 250 },
  { field: "status", headerName: "Estado", width: 150 },
  { field: "at", headerName: "Fecha de creaciòn ", width: 250 }
];
const rows = lista.recibos;
export default function Recibo() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <h1>Recibos</h1>
      {/* <button onClick={global}>Global</button> */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={50}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}
