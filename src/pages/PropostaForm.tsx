/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import {
  TextField,
  Button,
  Container,
  MenuItem,
  Autocomplete,
  Typography,
  Box,
} from "@mui/material";
import type { Cliente } from "../models/Cliente";
import { ClienteService } from "../services/ClienteService";
import { PropostaService } from "../services/PropostaService";
import { MoedaUtil } from "../utils/MoedaUtil";

const schema = yup.object({
  id: yup.number(),
  idCliente: yup.number().required("CLIENTE é obrigatorio"),
  numeroProposta: yup.string().required("PROPOSTA é obrigatório"),
  tipoSeguro: yup.string().required("SEGURO é obrigatório"),
  codigoStatus: yup
    .number()
    .required("STATUS é obrigatorio")
    .min(-1, "STATUS inválido"),
  dataCriacao: yup
    .string()
    .required("DATA DE CRIAÇÃO é obrigatório")
    .test(
      "inicio-menor-que-fim",
      "DATA DE CRIAÇÃO deve ser menor que DATA DE VALIDADE",
      function (value) {
        const { dataValidade } = this.parent;

        if (!value || !dataValidade) return true;

        return new Date(value) < new Date(dataValidade);
      },
    ),
  dataValidade: yup
    .string()
    .required("DATA VALIDADE é obrigatório")
    .test(
      "fim-maior-que-inicio",
      "DATA DE VALIDADE deve ser maior que DATA DE CRIAÇÂO",
      function (value) {
        const { dataCriacao } = this.parent;

        if (!value) return true; // pode ser nula

        return new Date(value) > new Date(dataCriacao);
      },
    ),
  formaPagamento: yup.string().required("FORMA DE PAGAMENTO é obrigatório"),
  valorCobertura: yup
    .number()
    .typeError("VALOR COBERTURA inválido")
    .min(0, "VALOR inválido"),

  premio: yup.number().typeError("PRÊMIO inválido").min(0, "PRÊMIO inválido"),
  quantidadeParcelas: yup.number().nullable(),

  canalVenda: yup.string().required("CANAL é obrigatório"),
  observacoes: yup.string().nullable(),
  nomeClienteCpf: yup.string().nullable(),
});

export function ApoliceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: 0,
      numeroProposta: "",
      valorCobertura: 0,
      premio: 0,
      quantidadeParcelas: 0,
      formaPagamento: "",
      dataCriacao: "",
      codigoStatus: 0,
      dataValidade: "",
      idCliente: 0,
      tipoSeguro: "",
      canalVenda: "",
      nomeClienteCpf: "",
      /*

 id: number,
    numeroProposta: string,
    tipoSeguro: string,
    dataCriacao: string,
    dataValidade: string | null,
    premio: number,
    valorCobertura: number,
    formaPagamento: string,
    quantidadeParcelas: number | null,
    canalVenda: string,
    observacoes: string | null,
    idCliente: number,
    nomeCliente: string | null,
    codigoStatus: number,
    status: string,
    nomeClienteCpf: string | null,
    mensagem: Mensagem | null

*/
    },
  });

  useEffect(() => {
    if (!isEdit) {
      ClienteService.listar().then(setClientes);
    } else {
      PropostaService.obterPorId(Number(id)).then((data) => {
        console.log(data);
        (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
          setValue(key as any, data[key] ?? ""); // gara
        });
      });
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    const response = await PropostaService.salvar(data, isEdit);

    if (response.mensagem?.sucesso) {
      toast.success(response.mensagem.descricao);
    } else {
      toast.error(response.mensagem?.descricao);
    }

    navigate("/propostas");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Typography variant="h5" mt={4} mb={3}>
        {isEdit ? "Editar Proposta" : "Nova Proposta"}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
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
                <h5>Dados da Proposta</h5>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="numeroProposta"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Número Proposta"
                      fullWidth
                      size="small"
                      value={field.value}
                      error={!!errors.numeroProposta}
                      helperText={errors.numeroProposta?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="tipoSeguro"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Tipo Seguro"
                      fullWidth
                      size="small"
                      value={field.value}
                      error={!!errors.tipoSeguro}
                      helperText={errors.tipoSeguro?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="codigoStatus"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Status"
                      select
                      fullWidth
                      size="small"
                      value={field.value ?? ""}
                    >
                      <MenuItem value={-1}>Todos</MenuItem>
                      <MenuItem value={1}>Ativo</MenuItem>
                      <MenuItem value={2}>Cancelado</MenuItem>
                      <MenuItem value={3}>Expirado</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
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
                <h5>Vigência</h5>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="dataCriacao"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <DatePicker
                      label="Data de Criação"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : null)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!errors.dataCriacao,
                          helperText: errors.dataCriacao?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="dataValidade"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <DatePicker
                      label="Data de Validade"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : null)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!errors.dataValidade,
                          helperText: errors.dataValidade?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
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
                <h5>Valores</h5>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="premio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Prêmio"
                      fullWidth
                      size="small"
                      value={MoedaUtil.formatarMoeda(field.value)}
                      onChange={(e) =>
                        field.onChange(MoedaUtil.parseMoeda(e.target.value))
                      }
                      error={!!errors.premio}
                      helperText={errors.premio?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="valorCobertura"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor Cobertura"
                      fullWidth
                      size="small"
                      value={MoedaUtil.formatarMoeda(field.value)}
                      onChange={(e) =>
                        field.onChange(MoedaUtil.parseMoeda(e.target.value))
                      }
                      error={!!errors.valorCobertura}
                      helperText={errors.valorCobertura?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
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
                <h5>Pagamento</h5>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Controller
                  name="formaPagamento"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Forma de Pagamento"
                      select
                      fullWidth
                      size="small"
                      value={field.value ?? ""}
                      error={!!errors.formaPagamento}
                      helperText={errors.formaPagamento?.message}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="Credito">Crédito</MenuItem>
                      <MenuItem value="Debito">Débito</MenuItem>
                      <MenuItem value="Boleto">Boleto</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="quantidadeParcelas"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Parcelas"
                      type="number"
                      fullWidth
                      size="small"
                      error={!!errors.quantidadeParcelas}
                      helperText={errors.quantidadeParcelas?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="canalVenda"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Canal de Venda"
                      fullWidth
                      size="small"
                      error={!!errors.canalVenda}
                      helperText={errors.canalVenda?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
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
                <h5>Cliente</h5>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {!isEdit ? (
                <Grid item xs={12} md={8}>
                  <Controller
                    name="idCliente"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={clientes}
                        getOptionLabel={(option) => `${option.nomeCpf}`}
                        onChange={(_, value) =>
                          field.onChange(value?.id ?? null)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cliente"
                            size="small"
                            fullWidth
                            error={!!errors.idCliente}
                            helperText={errors.idCliente?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} md={8}>
                  <Controller
                    name="idCliente" // <--- Verifique se o nome da chave na sua API é "clienteId" ou "id"
                    control={control}
                    render={({ field }) => (
                      <input type="hidden" {...field} value={field.value} />
                    )}
                  />
                  <Controller
                    name="nomeClienteCpf"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          label=""
                          fullWidth
                          size="small"
                          value={field.value}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
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
                <h5>Observações</h5>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Controller
                  name="observacoes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label=""
                      fullWidth
                      size="small"
                      value={field.value}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={2} sx={{ textAlign: "right" }}>
            <Button type="submit" variant="contained">
              {isEdit ? "Atualizar" : "Salvar"}
            </Button>

            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={() => navigate("/propostas")}
            >
              Cancelar
            </Button>
          </Grid>
        </form>
      </LocalizationProvider>
    </Container>
  );
}
