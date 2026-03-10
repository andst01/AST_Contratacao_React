/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApoliceService } from "../services/ApoliceService";
import { MoedaUtil } from "../utils/MoedaUtil";

import {
  TextField,
  Button,
  Container,
  MenuItem,
  Autocomplete,
  Typography,
  Box,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Proposta } from "../models/Proposta";
import { PropostaService } from "../services/PropostaService";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

const schema = yup.object({
  id: yup.number(),
  idProposta: yup.number().required("PROPOSTA é obrigatorio"),
  numeroApolice: yup.string().required("APÓLICE é obrigatório"),
  codigoStatus: yup.number().required("STATUS é obrigatório"),
  dataInicioVigencia: yup.string()
    .required("DATA VIGENCIA é obrigatório")
    .test(
      "inicio-menor-que-fim",
      "DATA INÍCIO deve ser menor que DATA FIM",
      function (value) {
        const { dataFimVigencia } = this.parent;

        if (!value || !dataFimVigencia) return true;

        return new Date(value) < new Date(dataFimVigencia);
      }
    ),
  dataFimVigencia: yup.string()
    .nullable()
    .test(
      "fim-maior-que-inicio",
      "DATA FIM deve ser maior que DATA INÍCIO",
      function (value) {
        const { dataInicioVigencia } = this.parent;

        if (!value) return true; // pode ser nula

        return new Date(value) > new Date(dataInicioVigencia);
      }
    ),
  formaPagamento: yup.string().required("FORMA DE PAGAMENTO é obrigatório"),
  valorCobertura: yup
    .number()
    .typeError("VALOR COBERTURA inválido")
    .min(0, "VALOR inválido"),
  
  premioFinal: yup
    .number()
    .typeError("PRÊMIO inválido")
    .min(0, "PRÊMIO inválido"),
  quantidadeParcelas: yup.number().nullable(),
  dataContratacao: yup.string().nullable(),
  numeroProposta: yup.string().nullable(),
});

export function ApoliceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [propostas, setPropostas] = useState<Proposta[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: 0,
      idProposta: 0,
      valorCobertura: 0,
      premioFinal: 0,
      quantidadeParcelas: 0,
      formaPagamento: "",
      dataContratacao: "",
      numeroProposta: "",
      numeroApolice: "",
      codigoStatus: 0,
      dataInicioVigencia: "",
      dataFimVigencia: "",
    },
  });

  useEffect(() => {
    if (!isEdit) {
      PropostaService.listar().then(setPropostas);
    } else {
      ApoliceService.obterPorId(Number(id)).then((data) => {
        console.log(data);
        (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
          setValue(key as any, data[key] ?? ""); // gara
        });
      });
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    const response = await ApoliceService.salvar(data, isEdit);

    if (response.mensagem?.sucesso) {
      toast.success(response.mensagem.descricao);
    } else {
      toast.error(response.mensagem?.descricao);
    }

    navigate("/apolices");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Typography variant="h5" mt={4} mb={3}>
        {isEdit ? "Editar Apólice" : "Nova Apólice"}
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
                  textAlign: "left"
                }}
              >
               <h5>Informações</h5> 
              </Box>
              <Grid container spacing={3}>
                {!isEdit ? (
                  <>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="numeroApolice"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Número Apólice"
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
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="idProposta"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={propostas}
                            getOptionLabel={(option) =>
                              `${option.numeroProposta} - ${option.nomeCliente}`
                            }
                            onChange={(_, value) =>
                              field.onChange(value?.id ?? null)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Proposta"
                                size="small"
                                fullWidth
                                error={!!errors.idProposta}
                                helperText={errors.idProposta?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="numeroApolice"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Número Apólice"
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
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
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
                        <MenuItem value="0">Ativa</MenuItem>
                        <MenuItem value="1">Cancelada</MenuItem>
                        <MenuItem value="2">Suspensa</MenuItem>
                        <MenuItem value="3">Encerrada</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
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
                  textAlign: "left"
                }}
              >
              <h5>Financeiro</h5>  
              </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Controller
                  name="valorCobertura"
                  control={control}
                  render={({ field }) => (
                    <TextField
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

              <Grid item xs={12} md={3}>
                <Controller
                  name="premioFinal"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Prêmio Final"
                      fullWidth
                      size="small"
                      value={MoedaUtil.formatarMoeda(field.value)}
                      onChange={(e) =>
                        field.onChange(MoedaUtil.parseMoeda(e.target.value))
                      }
                      error={!!errors.premioFinal}
                      helperText={errors.premioFinal?.message}
                    />
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
                    />
                  )}
                />
              </Grid>

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
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="Credito">Crédito</MenuItem>
                      <MenuItem value="Debito">Débito</MenuItem>
                      <MenuItem value="Boleto">Boleto</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </Box>

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
                  textAlign: "left"
                }}
              >
               <h5>Período</h5> 
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="dataContratacao"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <DatePicker
                        label="Data Contratação"
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : null)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.dataContratacao,
                            helperText: errors.dataContratacao?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="dataInicioVigencia"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <DatePicker
                        label="Data Início"
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : null)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.dataInicioVigencia,
                            helperText: errors.dataInicioVigencia?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="dataFimVigencia"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <DatePicker
                        label="Data Fim"
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : null)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.dataFimVigencia,
                            helperText: errors.dataFimVigencia?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} mt={2} sx={{textAlign: "right", marginBottom: "50px"}}>
            <Button type="submit" variant="contained">
              {isEdit ? "Atualizar" : "Salvar"}
            </Button>

            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={() => navigate("/apolices")}
            >
              Cancelar
            </Button>
          </Grid>
        </form>
      </LocalizationProvider>
    </Container>
  );
}
