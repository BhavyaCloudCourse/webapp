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


source "googlecompute" "test-image" {
  project_id          = var.project_id
  source_image_family = "centos-stream-8"
  zone                = var.zone
  ssh_username        = "admin"
}

build {
  sources = ["sources.googlecompute.test-image"]

  provisioner "file" {
    source      = var.app_file_src
    destination = var.app_file_dest
  }


  provisioner "shell" {
    execute_command = "{{.Vars}} sudo -E -S bash '{{.Path}}'"
    script          = var.script_path
  }
}