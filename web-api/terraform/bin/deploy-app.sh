#!/bin/bash

ENVIRONMENT=$1

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="documents-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform
echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
sh ../bin/create-bucket.sh "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output json --region "${REGION}" --query "contains(TableNames, '${LOCK_TABLE}')" | grep 'true'
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh ../bin/create-dynamodb.sh "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

# exit on any failure
set -eo pipefail

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
TF_VAR_my_s3_state_bucket="${BUCKET}" TF_VAR_my_s3_state_key="${KEY}" terraform apply -auto-approve -var "dns_domain=${EFCMS_DOMAIN}" -var "environment=${ENVIRONMENT}" -var "cognito_suffix=${COGNITO_SUFFIX}" -var "ses_dmarc_rua=${SES_DMARC_EMAIL}" -var "cloudwatch_role_arn=${CLOUDWATCH_ROLE_ARN}" -var "post_confirmation_role_arn=${POST_CONFIRMATION_ROLE_ARN}" -var "es_instance_count=${ES_INSTANCE_COUNT}"
