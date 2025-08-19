-- Verificar triggers ativos na tabela desvios_completos
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement,
    p.prosrc as function_definition
FROM information_schema.triggers t
LEFT JOIN pg_proc p ON p.proname = SPLIT_PART(TRIM(BOTH '()' FROM SPLIT_PART(t.action_statement, 'EXECUTE FUNCTION ', 2)), '(', 1)
WHERE t.event_object_table = 'desvios_completos';