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
var $ = jquery;
var elements;
for (let index = 0; index < tickets.length; index++) {
  const element = tickets[index];
}
var fecha = moment().format("MMMM Do YYYY, h:mm:ss a");
const Facturapi = require("facturapi");
const receipt = require("receipt");
const facturapi = new Facturapi("sk_live_NpE3r9Rl4KadW4JQNm5WM17oXQVng6xZ");

function nuevoCorte(params) {
  var fechaCorte = Date.now();
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

  $("#factura").append(url);
  $("#recibo").click();
}

async function global(params) {
  await facturapi.receipts.createGlobalInvoice({
    from: "2021-07-10T11:00:00.000Z",
    to: "2021-07-10T17:00:00.000Z"
  });
}
var ticket = (
  <div id="ticket">
    <div id="invoice-POS">
      <div id="mid">
        <div class="info">
          <p id="num_recibo">Recibo No.</p>
          <p>Alma Alicia Flores Zavala</p>
          <p>
            FOZA8801257C2 Carrera Torres 742 Heroe de Nacozari Ciudad Victoria
            Tamps. c.p.87030
          </p>
        </div>
      </div>

      <div id="bot">
        <div id="table">
          <table id="tableElement">
            <tr class="tabletitle">
              <td class="item">Cantidad</td>
              <td class="Hours">Producto</td>
              <td class="Rate">Importe</td>
            </tr>

            <tr class="tabletitle" id="totalTicket">
              <td class="Rate">
                <p>Total</p>
              </td>
              <td class="payment">
                <p id="total">0</p>
              </td>
            </tr>
          </table>
        </div>

        <div id="factura">
          Si necesita factura de este recibo favor de entrar a :
        </div>
      </div>
    </div>
  </div>
);
export default function fact() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => jsonCambio(data);
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);
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

        <input type="submit" value="agregar" />
      </form>
      {ticket}
      <MDBBtn onClick={recibo}>Hacer recibo</MDBBtn>
      <>
        <MDBBtn id="recibo" onClick={toggleShow}>
          Ver recibo
        </MDBBtn>
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
              <MDBModalBody>{ticket}</MDBModalBody>

              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={toggleShow}>
                  Cerrar
                </MDBBtn>
                <MDBBtn onClick={print}>Imprimir</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
    </div>
  );
}
function print(ticket) {
  var printContents = document.getElementById("ticket").innerHTML;
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
  var imp_ticket = Number(imp);
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

  jquery("#totalTicket").prepend(
    "<tr class='service'><td class='tableitem'><p class='itemtext'>" +
      data.cantidad +
      "</p></td> <td class='tableitem'><p class='itemtext'>" +
      data.descripcion +
      "</p></td><td class='tableitem'><p class='itemtext'>" +
      imp_ticket +
      "</p></td> </tr>"
  );

  jquery("#total").text(total);
}
