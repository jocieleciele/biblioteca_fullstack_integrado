import React from "react";
import MaterialDetail from "../components/MaterialDetail";
import api from "../services/api";

export default function Detail({ material, onBack, user }) {
  const m = material || {
    id: 0,
    titulo: "Sem seleção",
    autor: "",
    categoria: "",
    ano: "",
    capa: "",
    avaliação: 0,
    total: 0,
  };
  return <MaterialDetail material={m} onBack={onBack} user={user} />;
}
