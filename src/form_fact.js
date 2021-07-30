import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import jquery from "jquery";
import moment from "moment";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-react-ui-kit";

import "./styles.css";

var notas = {
  partidas: []
};
var output;
var tickets = [];
var elements;
for (let index = 0; index < tickets.length; index++) {
  const element = tickets[index];
  
}
var fecha = moment().format("MMMM Do YYYY, h:mm:ss a");
const Facturapi = require("facturapi");
const receipt = require("receipt");
const facturapi = new Facturapi("sk_test_VN9W1bQmxaKq2e4j6x81ry870rkwYEXe");

function nuevoCorte(params) {
  var fechaCorte = Date.now();
  db.insert(fechaCorte, function (err, newDoc) {
    // Callback is optional
    console.log(newDoc);
  });
}
var url;
var folio;
async function recibo() {
  const receipt2 = await facturapi.receipts.create({
    payment_form: Facturapi.PaymentForm.EFECTIVO,
    items: notas.partidas
  });
  url = receipt2.self_invoice_url;
  folio = receipt2.folio_number;
  console.log(url);
  receipt.config.currency = "$"; // The currency symbol to use in output.
  receipt.config.width = 100; // The amount of characters used to give the output a "width".
  receipt.config.ruler = "="; // The character used for ruler output.

  output = receipt.create([
    {
      type: "text",
      value: [
        "Alma Alicia Flores Zavala",
        "FOZA8801257C2",
        "Carrera Torres 742 Heroe de Nacozari",
        "Ciudad Victoria,Tamps. C.P.87030",
      ],
      align: "center"
    },
    { type: "empty" },
    {
      type: "properties",
      lines: [
        { name: "folio", value: folio },
        { name: "Fecha", value: fecha }
      ]
    },
    { type: "table", lines: tickets },
    { type: "empty" },

    { type: "empty" },
    {
      type: "properties",
      lines: [{ name: "Total", value: total }]
    },
    { type: "empty" },
    {
      type: "properties",
      lines: [
        { name: "Recibi", value: "" },
        { name: "Cambio", value: "" }
      ]
    },
    { type: "empty" },
    {
      type: "text",
      value: ["NOTA:para facturar este recibo entra a :" + url]
    }
  ]);

  console.log(output);
  
}

async function global(params) {
  await facturapi.receipts.createGlobalInvoice({
    from: "2021-07-10T11:00:00.000Z",
    to: "2021-07-10T17:00:00.000Z"
  });
}

export default function fact() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => jsonCambio(data);
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () =>setBasicModal(!basicModal); 
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="number" {...register("precio")} placeholder="Precio" />
        <input
          type="text"
          {...register("descripcion")}
          placeholder="Descripcion"
        />
        <input type="number" {...register("cantidad")} placeholder="cantidad" />
      
        <input type="submit"  value="agregar" />
      
      </form>
      <MDBBtn onClick={recibo}>Hacer recibo</MDBBtn>
      <>
        <MDBBtn onClick={toggleShow}>Ver recibo</MDBBtn>
        <MDBModal
          show={basicModal}
          getOpenState={(e: any) => setBasicModal(e)}
          tabIndex="-1"
        >
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Recibo</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={toggleShow}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <div id="ticket">{tickets}</div>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={toggleShow}>
                  Close
                </MDBBtn>
                <MDBBtn onClick={print}>print</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
    </div>
  );
}
function print(ticket) {
  var printContents = output;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}
var total;
var rec;

async function jsonCambio(data) {
  var imp = data.precio;
  var d1 = new Date();
  var d2 = Date.now();

  var newCon = {
    product: {
      description: "VENTA",
      product_key: "01010101",
      price: Number(imp),
      unit_key: "ACT"
    },
    fecha: d1.toString(),
    seconds: d2
  };
  var newCon2 = {
    item: data.descripcion,
    qty: Number(data.cantidad),
    cost: Number(imp)
  };
  notas.partidas.push(newCon);

  tickets.push(newCon2);
  console.log(tickets);

  total = 0;
  notas.partidas.forEach(function (obj) {
    total += Number(obj.product.price);
  });

  console.log("Ultimo" + imp + "total:" + total);
  // db.insert(newCon, function (err, newDoc) {   // Callback is optional
  //   console.log(newDoc);
  // });
  jquery(
    "<h1>Cantidad:" +
      data.cantidad +
      "/" +
      data.descripcion +
      "/importe" +
      imp +
      "</h1>"
  ).appendTo("#root");
  jquery("<h1>Total:" + total + "</h1>").appendTo("#root");
}
