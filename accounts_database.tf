variable "names" {
    default = ["users", "equipment"]
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "table" {
  for_each     = toset(var.names)

  name         = "${each.key}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "Table"
  }
}