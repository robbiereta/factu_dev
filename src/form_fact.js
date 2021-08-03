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
const facturapi = new Facturapi("sk_test_VN9W1bQmxaKq2e4j6x81ry870rkwYEXe");

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
  url = "<h6>" + receipt2.self_invoice_url + "</h61>";
  folio = receipt2.folio_number;
  console.log(url);

  $("#factura").append(url);
  $("#recibo").click();
}

var ticket = (
  <div id="ticket">
    <div id="invoice-POS">
      <div id="mid">
        <div class="info">
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
            <tbody>
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
            </tbody>
          </table>
        </div>

        <div id="factura">
          <h3>Si necesita factura de este recibo favor de entrar a :</h3>
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

        <MDBBtn color="success" type="submit" value="agregar">
          Agregar{" "}
        </MDBBtn>
      </form>
      <div id="ticket_content"></div>
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
      description: data.descripcion,
      product_key: "25174700",
      price: Number(imp),
      unit_key: "H87"
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
  jquery("#ticket_content").append(
    "<tr class='service'><td class='tableitem'><p class='itemtext'>" +
      data.cantidad +
      "</p></td> <td class='tableitem'><p class='itemtext'>" +
      data.descripcion +
      "</p></td><td class='tableitem'><p class='itemtext'>" +
      imp_ticket +
      "</p></td> </tr>"
  );
  jquery("#ticket_content").append("total:" + total);
  jquery("#total").text(total);
}
