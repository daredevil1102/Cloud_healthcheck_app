# =============================================================================
# AWS Secrets Manager Configuration
# =============================================================================

# =============================================================================
# Random Password Generation
# =============================================================================

resource "random_password" "jwt_secret" {
  length  = 64
  special = true
}

resource "random_password" "encryption_key" {
  length  = 32
  special = true
}

resource "random_password" "webhook_secret" {
  length  = 32
  special = true
}

resource "random_password" "aes_key" {
  length  = 32
  special = false
}

resource "random_password" "salt" {
  length  = 16
  special = false
}

# =============================================================================
# RSA Key Pair Generation
# =============================================================================

resource "tls_private_key" "rsa_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# =============================================================================
# Database Credentials Secret
# =============================================================================

resource "aws_secretsmanager_secret" "database_credentials" {
  count = var.enable_secrets_manager ? 1 : 0

  name                    = "${var.project_name}-${var.environment}-database-credentials"
  description             = "Database credentials for ${var.project_name} ${var.environment}"
  recovery_window_in_days = var.secrets_recovery_window
  kms_key_id             = var.create_additional_kms_keys ? aws_kms_key.secrets[0].arn : null

  tags = merge(var.tags, var.security_tags, {
    Name        = "${var.project_name}-${var.environment}-database-credentials"
    Purpose     = "database-secrets"
    Module      = "security"
  })
}

resource "aws_secretsmanager_secret_version" "database_credentials" {
  count = var.enable_secrets_manager ? 1 : 0

  secret_id = aws_secretsmanager_secret.database_credentials[0].id
  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    engine   = "postgres"
    host     = var.db_host
    port     = 5432
    dbname   = "education_platform"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

# =============================================================================
# API Keys Secret
# =============================================================================

resource "aws_secretsmanager_secret" "api_keys" {
  count = var.enable_secrets_manager ? 1 : 0

  name                    = "${var.project_name}-${var.environment}-api-keys"
  description             = "API keys and tokens for ${var.project_name} ${var.environment}"
  recovery_window_in_days = var.secrets_recovery_window
  kms_key_id             = var.create_additional_kms_keys ? aws_kms_key.secrets[0].arn : null

  tags = merge(var.tags, var.security_tags, {
    Name        = "${var.project_name}-${var.environment}-api-keys"
    Purpose     = "api-secrets"
    Module      = "security"
  })
}

resource "aws_secretsmanager_secret_version" "api_keys" {
  count = var.enable_secrets_manager ? 1 : 0

  secret_id = aws_secretsmanager_secret.api_keys[0].id
  secret_string = jsonencode({
    github_token     = var.github_token
    jwt_secret       = random_password.jwt_secret.result
    encryption_key   = random_password.encryption_key.result
    webhook_secret   = random_password.webhook_secret.result
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

# =============================================================================
# Encryption Keys Secret
# =============================================================================

resource "aws_secretsmanager_secret" "encryption_keys" {
  count = var.enable_secrets_manager ? 1 : 0

  name                    = "${var.project_name}-${var.environment}-encryption-keys"
  description             = "Encryption keys for ${var.project_name} ${var.environment}"
  recovery_window_in_days = var.secrets_recovery_window
  kms_key_id             = var.create_additional_kms_keys ? aws_kms_key.secrets[0].arn : null

  tags = merge(var.tags, var.security_tags, {
    Name        = "${var.project_name}-${var.environment}-encryption-keys"
    Purpose     = "encryption-secrets"
    Module      = "security"
  })
}

resource "aws_secretsmanager_secret_version" "encryption_keys" {
  count = var.enable_secrets_manager ? 1 : 0

  secret_id = aws_secretsmanager_secret.encryption_keys[0].id
  secret_string = jsonencode({
    aes_key         = random_password.aes_key.result
    rsa_private_key = tls_private_key.rsa_key.private_key_pem
    rsa_public_key  = tls_private_key.rsa_key.public_key_pem
    salt            = random_password.salt.result
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

# =============================================================================
# Third-Party Service Credentials
# =============================================================================

resource "aws_secretsmanager_secret" "third_party_credentials" {
  count = var.enable_secrets_manager ? 1 : 0

  name                    = "${var.project_name}-${var.environment}-third-party-credentials"
  description             = "Third-party service credentials for ${var.project_name} ${var.environment}"
  recovery_window_in_days = var.secrets_recovery_window
  kms_key_id             = var.create_additional_kms_keys ? aws_kms_key.secrets[0].arn : null

  tags = merge(var.tags, var.security_tags, {
    Name        = "${var.project_name}-${var.environment}-third-party-credentials"
    Purpose     = "third-party-secrets"
    Module      = "security"
  })
}

resource "aws_secretsmanager_secret_version" "third_party_credentials" {
  count = var.enable_secrets_manager ? 1 : 0

  secret_id = aws_secretsmanager_secret.third_party_credentials[0].id
  secret_string = jsonencode({
    smtp_username    = var.smtp_username
    smtp_password    = var.smtp_password
    oauth_client_id  = var.oauth_client_id
    oauth_secret     = var.oauth_secret
    analytics_key    = var.analytics_key
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

# =============================================================================
# Secrets Manager Resource Policies
# =============================================================================

resource "aws_secretsmanager_secret_policy" "database_credentials" {
  count = var.enable_secrets_manager ? 1 : 0

  secret_arn = aws_secretsmanager_secret.database_credentials[0].arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowRDSAccess"
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
        }
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "secretsmanager:ResourceTag/Purpose" = "database-secrets"
          }
        }
      }
    ]
  })
}

# =============================================================================
# Automatic Secret Rotation (for supported services)
# =============================================================================

# Automatic secret rotation for production environments
resource "aws_secretsmanager_secret_rotation" "database_credentials" {
  count = var.enable_secrets_manager && var.environment == "prod" && var.enable_secret_rotation ? 1 : 0

  secret_id           = aws_secretsmanager_secret.database_credentials[0].id
  rotation_lambda_arn = "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:SecretsManagerRDSPostgreSQLRotationSingleUser"

  rotation_rules {
    automatically_after_days = 30
  }
}

# =============================================================================
# Data Sources
# =============================================================================

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}