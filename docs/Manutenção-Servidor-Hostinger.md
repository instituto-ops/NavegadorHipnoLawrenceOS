# Automações de Manutenção no Hostinger (NeuroStrategy OS)

Aqui estão os códigos dos scripts PHP que devem ser enviados para a sua pasta `public_html` no Hostinger para habilitar os Cron Jobs que você planejou.

## 1. Backup do Banco de Dados (`backup-db.php`)

Este script cria um dump do SQL e envia para o seu e-mail de administrador.

```php
<?php
/**
 * Script de Backup Automático para Hostinger
 * Local: /home/uXXXXX/public_html/backup-db.php
 */

// 1. Carregar as configurações do WordPress de forma segura
require_once('wp-config.php');

$backup_file = 'backups/db_backup_' . date('Y-m-d_H-i-s') . '.sql';
$backup_path = dirname(__FILE__) . '/' . $backup_file;

// Criar pasta de backup se não existir
if (!file_exists('backups')) {
    mkdir('backups', 0755, true);
}

// 2. Comando mysqldump (nativo Hostinger)
$command = sprintf(
    'mysqldump --host=%s --user=%s --password=%s %s > %s',
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    $backup_path
);

exec($command, $output, $return_var);

if ($return_var === 0) {
    echo "✓ Backup criado com sucesso: $backup_file\n";
    
    // 3. Enviar e-mail de notificação (Opcional)
    $to = get_option('admin_email');
    $subject = 'NeuroStrategy OS: Backup Semanal Concluído';
    $message = "O backup do banco de dados foi realizado com sucesso e está salvo em: $backup_file";
    
    wp_mail($to, $subject, $message);
} else {
    echo "❌ Erro ao criar backup.";
}
?>
```

## 2. Limpeza de Cache (`clear-cache.php`)

Este script força a limpeza do sistema de cache do WordPress e do servidor LiteSpeed.

```php
<?php
/**
 * Script de Limpeza de Cache para Hostinger
 * Local: /home/uXXXXX/public_html/clear-cache.php
 */

// Carregar WordPress
define('WP_USE_THEMES', false);
require_once('wp-load.php');

echo "🚀 Iniciando limpeza de cache...\n";

// 1. Limpar cache de objetos interno do WordPress
wp_cache_flush();
echo "✓ Cache de objetos limpo.\n";

// 2. Limpar cache do LiteSpeed (se o plugin estiver ativo)
if (class_exists('LiteSpeed_Cache_API')) {
    LiteSpeed_Cache_API::purge_all();
    echo "✓ Cache LiteSpeed purgado com sucesso.\n";
}

// 3. Limpar cache do plugin WP Rocket ou Autoptimize (se existirem)
if (function_exists('rocket_clean_domain')) {
    rocket_clean_domain();
    echo "✓ WP Rocket limpo.\n";
}

if (extension_loaded('opcache')) {
    opcache_reset();
    echo "✓ OPcache resetado.\n";
}

echo "✅ Manutenção concluída às " . date('H:i:s') . "\n";
?>
```

---

## 📅 Configuração dos Cron Jobs no Painel Hostinger (hPanel)

Para que esses scripts rodem sozinhos, adicione estas linhas na seção **Tarefas Cron (Cron Jobs)** do seu painel Hostinger:

### Backup Semanal (Segundas às 08h)
- **Minuto:** `0`
- **Hora:** `8`
- **Dia do Mês:** `*`
- **Mês:** `*`
- **Dia da Semana:** `1`
- **Comando:** `/usr/bin/php /home/uXXXXX/public_html/backup-db.php`

### Limpeza de Cache (06h, 12h, 18h)
- **Minuto:** `0`
- **Hora:** `6,12,18`
- **Dia do Mês:** `*`
- **Mês:** `*`
- **Dia da Semana:** `*`
- **Comando:** `/usr/bin/php /home/uXXXXX/public_html/clear-cache.php`

> [!IMPORTANT]
> Lembre-se de trocar `uXXXXX` pelo seu usuário real da Hostinger. Você encontra esse caminho no topo do seu Gerenciador de Arquivos.
