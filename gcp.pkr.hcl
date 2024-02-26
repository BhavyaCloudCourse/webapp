packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "project_id" {
  type = string
}

variable "zone" {
  type = string
}

variable "script_path" {
  type = string
}
variable "app_file_src" {
  type = string
}

variable "app_file_dest" {
  type = string
}

variable "source_image_family" {
  type = string
}
variable "ssh_username" {
  type = string
}
variable "image_family" {
  type = string
}

variable "dbuser" {
  type = string
}
variable "dbpasswd" {
  type = string
}

source "googlecompute" "test-image" {
  project_id          = var.project_id
  source_image_family = var.source_image_family
  zone                = var.zone
  ssh_username        = var.ssh_username
  image_family        = var.image_family
  image_name          = "packer-${formatdate("YYYYMMDDHHmmss", timestamp())}"
}

build {
  sources = ["sources.googlecompute.test-image"]

  provisioner "file" {
    source      = var.app_file_src
    destination = var.app_file_dest
  }


  provisioner "shell" {
    environment_vars = ["DBUSER=${var.dbuser}", "DBPASSWD=${var.dbpasswd}"]
    execute_command  = "{{.Vars}} sudo -E -S bash '{{.Path}}'"
    script           = var.script_path
  }
}
