/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApoliceService } from "../services/ApoliceService";
import type { Apolice } from "../models/Apolice";
import { useEffect, useState, useRef } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import { useNavigate } from "react-router-dom";
import { Modal, Button as ReactButton } from "react-bootstrap";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { TextField, MenuItem, Button, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
//import { Button as ReactButton }from "react-bootstrap/Button";

// eslint-disable-next-line react-hooks/rules-of-hooks
DataTable.use(DT);

export function ListaApolice() {
  const tableRef = useRef<any>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [apoliceSelecionada, setApoliceSelecionada] = useState<Apolice | null>(
    null,
  );

  const [apolices, setApolices] = useState<Apolice[]>([]);

  const [filtros, setFiltros] = useState({
    dataContratacao: "",
    numeroApolice: "",
    codigoStatus: "-1",
  });

  const carregarApolices = () => {
    ApoliceService.listarApoliceCliente(filtros)
      .then(setApolices)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    carregarApolices();
  }, []);

  useEffect(() => {
    const table = document.querySelector("#tabela-apolice");

    const handleClick = (event: any) => {
      const target = event.target.closest("button");
      if (!target) return;

      const row = target.closest("tr");
      if (!row || !tableRef.current) return;

      const dt = tableRef.current.dt(); // ✅ usar dt()
      const data = dt.row(row).data();
      if (!data) return;

      if (target.classList.contains("btn-editar")) {
        navigate(`/apolices/editar/${data.id}`);
      }

      if (target.classList.contains("btn-excluir")) {
        setApoliceSelecionada(data);
        setShowModal(true);
      }
    };

    table?.addEventListener("click", handleClick);

    return () => {
      table?.removeEventListener("click", handleClick);
    };
  }, []);

  const confirmarExclusao = async () => {
    if (!apoliceSelecionada) return;

    //await ApoliceService.excluir(apoliceSelecionada.id);

    toast.success("Apólice excluída com sucesso!");

    setShowModal(false);
    carregarApolices();
  };

  return (
    <div className="container mt-8">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Box
          component="fieldset"
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 3,
            padding: "30px",
            marginBottom: "20px",
          }}
        >
          <Box
            component="legend"
            sx={{
              px: 1,
              fontWeight: 600,
              fontSize: "0.9rem",
              textAlign: "left",
            }}
          >
            <h5>Pesquisa</h5>
          </Box>
          <Grid container spacing={2} alignItems="end" mb={2}>
            <Grid item xs={12} md={3}>
              
              <DatePicker
                label="Data Contratação"
                format="DD/MM/YYYY"
                value={
                  filtros.dataContratacao
                    ? dayjs(filtros.dataContratacao)
                    : dayjs()
                }
                onChange={(novaData) =>
                  setFiltros({
                    ...filtros,
                    dataContratacao: novaData ? novaData.format("DD/MM/YYYY") : "",
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Número Apólice"
                fullWidth
                size="small"
                value={filtros.numeroApolice}
                onChange={(e) =>
                  setFiltros({ ...filtros, numeroApolice: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Status"
                fullWidth
                size="small"
                value={filtros.codigoStatus}
                onChange={(e) =>
                  setFiltros({ ...filtros, codigoStatus: e.target.value })
                }
              >
                <MenuItem value={-1}>Todos</MenuItem>
                <MenuItem value={1}>Ativo</MenuItem>
                <MenuItem value={2}>Cancelado</MenuItem>
                <MenuItem value={3}>Expirado</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3} display="flex" gap={2}>
              <Button variant="contained" onClick={carregarApolices} fullWidth>
                Pesquisar
              </Button>

              <Button
                variant="outlined"
                color="success"
                fullWidth
                onClick={() => navigate("/apolices/nova")}
              >
                Novo
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
      <Box
        component="fieldset"
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 3,
          padding: "30px",
          marginBottom: "20px",
        }}
      >
        {" "}
        <Box
          component="legend"
          sx={{
            px: 1,
            fontWeight: 600,
            fontSize: "0.9rem",
            textAlign: "left",
          }}
        >
          <h5>Lista de Apólices</h5>
          <p></p>
        </Box>
        <DataTable
          id="tabela-apolice"
          ref={tableRef}
          data={apolices}
          className="display table table-striped w-100"
          columns={[
            { title: "Número Apólice", data: "numeroApolice" },
            {
              title: "Cobertura",
              data: "valorCobertura",
              render: (data: number) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(data),
            },
            {
              title: "Prêmio",
              data: "premioFinal",
              render: (data: number) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(data),
            },
            {
              title: "Data da Contratação",
              data: "dataContratacao",
              render: (data: string) =>
                new Intl.DateTimeFormat("pt-BR").format(new Date(data)),
            },
            { title: "Status", data: "status" },
            {
              title: "Ações",
              data: null,
              orderable: false,
              searchable: false,
              render: function (row) {
                const isAtivo = row.codigoStatus === 0;

                return `<div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-primary btn-editar">
                                        ✏️
                                    </button>
                                    <button class="btn btn-sm btn-danger btn-excluir"
                                     ${isAtivo ? "disabled title='Só é possível excluir quando Ativo'" : ""}>
                                        🗑️
                                    </button>
                                    </div>
                                `;
              },
            },
          ]}
          options={{
            paging: true,
            searching: false,
            ordering: true,
            autoWidth: false,
            pageLength: 5,
            lengthMenu: [
              [3, 5, 10, 25],
              [3, 5, 10, 25],
            ],
            language: {
              lengthMenu: "Exibir _MENU_ registros por página",
              zeroRecords: "Nenhum registro encontrado",
              info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
              infoEmpty: "Nenhum registro disponível",
              infoFiltered: "(filtrado de _MAX_ registros no total)",
              search: "Pesquisar:",
              paginate: {
                first: "Primeiro",
                last: "Último",
                next: "Próximo",
                previous: "Anterior",
              },
            },
          }}
        ></DataTable>
      </Box>
      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja realmente excluir a apólice{" "}
          <strong>{apoliceSelecionada?.numeroApolice}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Grid>
            <ReactButton
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </ReactButton>
            <ReactButton
              type="button"
              variant="danger"
              onClick={confirmarExclusao}
            >
              Excluir
            </ReactButton>
          </Grid>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
