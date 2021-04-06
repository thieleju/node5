<template>
  <v-app id="inspire">
    <router-view />
    <v-footer app color="grey darken-4" class="py-1">
      <span class="mr-auto overline">Node 5 &copy;2020</span>
      <v-spacer></v-spacer>
      <a class="mr-auto overline" @click="openDSGVO">Datenschutzerklärung</a>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

export default {
  data() {
    return {
      dsgvo: null
    }
  },
  created() {},
  methods: {
    openDSGVO() {
      if (!this.dsgvo) {
        axios.get("/public/dsgvo").then(data => {
          this.dsgvo = data.data
          this.showSwal(data.data)
        })
      } else {
        this.showSwal(this.dsgvo)
      }
    },
    showSwal(data) {
      Swal.fire({
        width: 800,
        html: data,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        showClass: {
          popup: ""
        },
        confirmButtonText: '<i class="fa"></i> Close'
      })
    }
  }
}
</script>

<style lang="scss">
.swal2-html-container {
  text-align: justify !important;
}
</style>
