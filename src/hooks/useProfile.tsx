
import { useState, useEffect } from "react";

export const useProfile = () => {
  const [userPermissoes, setUserPermissoes] = useState({
    menus_sidebar: [
      "dashboard",
      "admin_modelos_inspecao",
      "inspecao_sms_cadastro",
      "inspecao_sms_dashboard"
    ]
  });

  return {
    userPermissoes,
    isLoading: false
  };
};
