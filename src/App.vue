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
  created() {
    // axios.interceptors.response.use(
    //   response => response,
    //   error => {
    //     if (error.response.status === 401) {
    //       // this.$store.dispatch("logout")
    //     }
    //     return Promise.reject(error)
    //   }
    // )
  },
  methods: {
    openDSGVO() {
      if (!this.dsgvo) {
        axios
          .get(this.$store.getters.getRootUrl + "/api/dsgvo.html")
          .then(data => {
            this.dsgvo = data.data
            this.showSwal(data.data)
          })
      } else {
        this.showSwal(this.dsgvo)
      }
    },
    showSwal(data) {
      Swal.fire({
        // title: "<strong>Datenschutzerklärung</strong>",
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
