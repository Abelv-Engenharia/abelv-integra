import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Clock,
  ClipboardCheck,
  AlertTriangle,
  Gavel,
  BarChart3,
  Shield,
  Flame,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarSectionGestaoSMSProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick?: () => void;
  /** Predicado de permissão (whitelist menus_sidebar). */
  canSee?: (slug: string) => boolean;
}

type LinkItem = { label: string; to: string; slug: string };

export default function SidebarSectionGestaoSMS({
  openMenu,
  toggleMenu,
  onLinkClick,
  canSee,
}: SidebarSectionGestaoSMSProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const can = useMemo<(slug: string) => boolean>(() => {
    return (slug: string) => {
      const result = canSee ? canSee(slug) : true;
      console.log('📱 [SidebarSMS] Testando slug:', slug, 'Resultado:', result);
      return result;
    };
  }, [canSee]);

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const getActiveSubmenu = (path: string) => {
    if (path.startsWith("/idsms")) return "idsms";
    if (path.startsWith("/desvios")) return "desvios";
    if (path.startsWith("/treinamentos")) return "treinamentos";
    if (path.startsWith("/hora-seguranca")) return "hora-seguranca";
    if (path.startsWith("/inspecao-sms")) return "inspecao-sms";
    if (path.startsWith("/ocorrencias")) return "ocorrencias";
    if (path.startsWith("/medidas-disciplinares")) return "medidas-disciplinares";
    if (path.startsWith("/gro")) return "gro";
    if (path.startsWith("/prevencao-incendio")) return "prevencao-incendio";
    return null;
  };

  useEffect(() => {
    const active = getActiveSubmenu(currentPath);
    setOpenSubMenus(active ? { [active]: true } : {});
  }, [currentPath]);

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => (prev[key] ? {} : { [key]: true }));
  };

  const isGestaoSMSOpen = openMenu === "gestao-sms";

  // ===== LINKS COM SLUGS 1:1 COM menus_sidebar =====
  const idsmsItems: LinkItem[] = [
    { label: "Dashboard", to: "/idsms/dashboard", slug: "idsms_dashboard" },
    { label: "Indicadores", to: "/idsms/indicadores", slug: "idsms_indicadores" },
    { label: "HT", to: "/idsms/ht", slug: "idsms_ht" },
    { label: "HSA", to: "/idsms/hsa", slug: "idsms_hsa" },
    { label: "IID", to: "/idsms/iid", slug: "idsms_iid" },
    { label: "IPOM", to: "/idsms/ipom", slug: "idsms_ipom" },
    { label: "Índice Reativo", to: "/idsms/indice-reativo", slug: "idsms_indice_reativo" },
    { label: "Inspeção Alta Liderança", to: "/idsms/inspecao-alta-lideranca", slug: "idsms_inspecao_alta_lideranca" },
    { label: "Inspeção Gestão SMS", to: "/idsms/inspecao-gestao-sms", slug: "idsms_inspecao_gestao_sms" },
  ];

  const desviosItems: LinkItem[] = [
    { label: "Dashboard", to: "/desvios/dashboard", slug: "desvios_dashboard" },
    { label: "Cadastro", to: "/desvios/cadastro", slug: "desvios_cadastro" },
    { label: "Consulta", to: "/desvios/consulta", slug: "desvios_consulta" },
    { label: "Não Conformidade", to: "/desvios/nao-conformidade", slug: "desvios_nao_conformidade" },
  ];

  const treinamentosItems: LinkItem[] = [
    { label: "Dashboard", to: "/treinamentos/dashboard", slug: "treinamentos_dashboard" },
    { label: "Normativo", to: "/treinamentos/normativo", slug: "treinamentos_normativo" },
    { label: "Consulta", to: "/treinamentos/consulta", slug: "treinamentos_consulta" },
    { label: "Execução", to: "/treinamentos/execucao", slug: "treinamentos_execucao" },
    { label: "Crachá", to: "/treinamentos/cracha", slug: "treinamentos_cracha" },
  ];

  const horaSegurancaItems: LinkItem[] = [
    { label: "Dashboard", to: "/hora-seguranca/dashboard", slug: "hora_seguranca_dashboard" },
    { label: "Cadastro", to: "/hora-seguranca/inspecao-cadastro-hsa", slug: "hora_seguranca_cadastro_inspecao" },
    { label: "Agenda", to: "/hora-seguranca/agenda-hsa", slug: "hora_seguranca_agenda" },
    { label: "Acompanhamento", to: "/hora-seguranca/inspecoes-acompanhamento", slug: "hora_seguranca_acompanhamento" },
    { label: "Inspeção Não Programada", to: "/hora-seguranca/inspecao-nao-programada-hsa", slug: "hora_seguranca_cadastro_nao_programada" },
  ];

  const inspecaoSmsItems: LinkItem[] = [
    { label: "Dashboard", to: "/inspecao-sms/dashboard", slug: "inspecao_sms_dashboard" },
    { label: "Cadastro", to: "/inspecao-sms/cadastrar", slug: "inspecao_sms_cadastrar" },
    { label: "Consulta", to: "/inspecao-sms/consulta", slug: "inspecao_sms_consulta" },
  ];

  const ocorrenciasItems: LinkItem[] = [
    { label: "Dashboard", to: "/ocorrencias/dashboard", slug: "ocorrencias_dashboard" },
    { label: "Cadastro", to: "/ocorrencias/cadastro", slug: "ocorrencias_cadastro" },
    { label: "Consulta", to: "/ocorrencias/consulta", slug: "ocorrencias_consulta" },
  ];

  const medidasDiscItems: LinkItem[] = [
    { label: "Dashboard", to: "/medidas-disciplinares/dashboard", slug: "medidas_disciplinares_dashboard" },
    { label: "Cadastro", to: "/medidas-disciplinares/cadastro", slug: "medidas_disciplinares_cadastro" },
    { label: "Consulta", to: "/medidas-disciplinares/consulta", slug: "medidas_disciplinares_consulta" },
  ];

  const groItems: LinkItem[] = [
    { label: "Dashboard", to: "/gro/dashboard", slug: "gro_dashboard" },
    { label: "Cadastro de Perigos", to: "/gro/cadastro-perigos", slug: "gro_cadastro_perigos" },
    { label: "Avaliação de Riscos", to: "/gro/avaliacao-riscos", slug: "gro_avaliacao_riscos" },
    { label: "PGR", to: "/gro/pgr", slug: "gro_pgr" },
    { label: "Cadastro", to: "/gro/cadastro", slug: "gro_cadastro" },
    { label: "Consulta", to: "/gro/consulta", slug: "gro_consulta" },
  ];

  const prevIncendioItems: LinkItem[] = [
    { label: "Dashboard", to: "/prevencao-incendio/dashboard", slug: "prevencao_incendio_dashboard" },
    { label: "Cadastro de Extintores", to: "/prevencao-incendio/cadastro-extintores", slug: "prevencao_incendio_cadastro_extintores" },
    { label: "Inspeção de Extintores", to: "/prevencao-incendio/inspecao-extintores", slug: "prevencao_incendio_inspecao_extintores" },
    { label: "Consulta de Inspeções", to: "/prevencao-incendio/consulta-inspecoes", slug: "prevencao_incendio_consulta_inspecoes" },
  ];

  const filterAllowed = (items: LinkItem[]) => items.filter((i) => can(i.slug));

  const idsms = filterAllowed(idsmsItems);
  const desvios = filterAllowed(desviosItems);
  const treinamentos = filterAllowed(treinamentosItems);
  const horaSeg = filterAllowed(horaSegurancaItems);
  const inspecao = filterAllowed(inspecaoSmsItems);
  const ocorrencias = filterAllowed(ocorrenciasItems);
  const medidas = filterAllowed(medidasDiscItems);
  const gro = filterAllowed(groItems);
  const prevInc = filterAllowed(prevIncendioItems);

  const showSmsDashboard = can("sms_dashboard");

  const sectionIsEmpty =
    !showSmsDashboard &&
    idsms.length === 0 &&
    desvios.length === 0 &&
    treinamentos.length === 0 &&
    horaSeg.length === 0 &&
    inspecao.length === 0 &&
    ocorrencias.length === 0 &&
    medidas.length === 0 &&
    gro.length === 0 &&
    prevInc.length === 0;

  if (sectionIsEmpty) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={openMenu === "gestao-sms"}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("gestao-sms")} className="text-white hover:bg-slate-600">
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">SMS</span>
              {openSubMenus["gestao-sms"] ? (
                <ChevronDown className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Dashboard SMS direto */}
              {showSmsDashboard && (
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    className={
                      currentPath === "/sms/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                    }
                  >
                    <Link to="/sms/dashboard" className="flex items-center gap-2" onClick={onLinkClick}>
                      <BarChart3 className="h-3 w-3 flex-shrink-0" />
                      <span>Dashboard SMS</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )}

              {/* IDSMS */}
              {idsms.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("idsms")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-3 w-3 flex-shrink-0" />
                        <span>IDSMS</span>
                      </div>
                      {openSubMenus.idsms ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus.idsms && (
                      <div className="ml-4 mt-1 space-y-1">
                        {idsms.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to} onClick={onLinkClick}>
                              {it.label}
                            </Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Desvios */}
              {desvios.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("desvios")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                        <span>Desvios</span>
                      </div>
                      {openSubMenus.desvios ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus.desvios && (
                      <div className="ml-4 mt-1 space-y-1">
                        {desvios.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to}>{it.label}</Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Treinamentos */}
              {treinamentos.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("treinamentos")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-3 w-3 flex-shrink-0" />
                        <span>Treinamentos</span>
                      </div>
                      {openSubMenus.treinamentos ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus.treinamentos && (
                      <div className="ml-4 mt-1 space-y-1">
                        {treinamentos.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to}>{it.label}</Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Hora da Segurança */}
              {horaSeg.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("hora-seguranca")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>Hora da Segurança</span>
                      </div>
                      {openSubMenus["hora-seguranca"] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus["hora-seguranca"] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {horaSeg.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={`h-auto py-2 [&>span:last-child]:!whitespace-normal [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip ${
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }`}
                          >
                            <Link to={it.to} className="flex items-center gap-2">
                              <span className="text-xs leading-normal whitespace-normal max-w-[140px]">{it.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Inspeção SMS */}
              {inspecao.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("inspecao-sms")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-3 w-3 flex-shrink-0" />
                        <span>Inspeção SMS</span>
                      </div>
                      {openSubMenus["inspecao-sms"] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus["inspecao-sms"] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {inspecao.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to}>{it.label}</Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Ocorrências */}
              {ocorrencias.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("ocorrencias")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                        <span>Ocorrências</span>
                      </div>
                      {openSubMenus.ocorrencias ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus.ocorrencias && (
                      <div className="ml-4 mt-1 space-y-1">
                        {ocorrencias.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to}>{it.label}</Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Medidas Disciplinares */}
              {medidas.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("medidas-disciplinares")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Gavel className="h-3 w-3 flex-shrink-0" />
                        <span>Medidas Disciplinares</span>
                      </div>
                      {openSubMenus["medidas-disciplinares"] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus["medidas-disciplinares"] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {medidas.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to}>{it.label}</Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* GRO */}
              {gro.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("gro")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 flex-shrink-0" />
                        <span>GRO</span>
                      </div>
                      {openSubMenus.gro ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus.gro && (
                      <div className="ml-4 mt-1 space-y-1">
                        {gro.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to}>{it.label}</Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Prevenção de Incêndio */}
              {prevInc.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="w-full">
                    <button
                      onClick={() => toggleSubMenu("prevencao-incendio")}
                      className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Flame className="h-3 w-3 flex-shrink-0" />
                        <span>Prevenção de Incêndio</span>
                      </div>
                      {openSubMenus["prevencao-incendio"] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {openSubMenus["prevencao-incendio"] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {prevInc.map((it) => (
                          <SidebarMenuSubButton
                            key={it.slug}
                            asChild
                            className={
                              currentPath === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }
                          >
                            <Link to={it.to}>{it.label}</Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
