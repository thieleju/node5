<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex class="cont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline textColor">
            Coinbase Production Settings
          </v-card-title>

          <v-text-field
            class="paddingTopCont"
            label="API Key"
            hide-details="auto"
            :append-icon="
              settings.production.api.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="settings.production.api.showpass ? 'text' : 'password'"
            @click:append="
              settings.production.api.showpass = !settings.production.api
                .showpass
            "
            v-model="settings.production.api.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Passphrase"
            hide-details="auto"
            :append-icon="
              settings.production.phrase.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="settings.production.phrase.showpass ? 'text' : 'password'"
            @click:append="
              settings.production.phrase.showpass = !settings.production.phrase
                .showpass
            "
            v-model="settings.production.phrase.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Secret"
            hide-details="auto"
            :append-icon="
              settings.production.secret.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="settings.production.secret.showpass ? 'text' : 'password'"
            @click:append="
              settings.production.secret.showpass = !settings.production.secret
                .showpass
            "
            v-model="settings.production.secret.data"
          ></v-text-field>
        </v-card>
      </v-flex>

      <v-flex class="cont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline textColor">
            Coinbase Sandbox Settings
          </v-card-title>

          <v-text-field
            class="paddingTopCont"
            label="API Key"
            hide-details="auto"
            :append-icon="
              settings.sandbox.api.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="settings.sandbox.api.showpass ? 'text' : 'password'"
            @click:append="
              settings.sandbox.api.showpass = !settings.sandbox.api.showpass
            "
            v-model="settings.sandbox.api.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Passphrase"
            hide-details="auto"
            :append-icon="
              settings.sandbox.phrase.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="settings.sandbox.phrase.showpass ? 'text' : 'password'"
            @click:append="
              settings.sandbox.phrase.showpass = !settings.sandbox.phrase
                .showpass
            "
            v-model="settings.sandbox.phrase.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Secret"
            hide-details="auto"
            :append-icon="
              settings.sandbox.secret.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="settings.sandbox.secret.showpass ? 'text' : 'password'"
            @click:append="
              settings.sandbox.secret.showpass = !settings.sandbox.secret
                .showpass
            "
            v-model="settings.sandbox.secret.data"
          ></v-text-field>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout column>
      <v-flex class="contbottom">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline textColor">
            General Settings
          </v-card-title>

          <v-select
            class="paddingBottomCont"
            :items="items"
            v-model="settings.general.sandboxMode"
            label="Sandbox Mode"
          ></v-select>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="accent" @click="saveChanges">
              Save changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

export default {
  data() {
    return {
      inputRules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      settings: {
        general: {
          sandboxMode: ""
        },
        production: {
          api: {
            showpass: false,
            data: ""
          },
          phrase: {
            showpass: false,
            data: ""
          },
          secret: {
            showpass: false,
            data: ""
          }
        },
        sandbox: {
          api: {
            showpass: false,
            data: ""
          },
          phrase: {
            showpass: false,
            data: ""
          },
          secret: {
            showpass: false,
            data: ""
          }
        }
      },
      items: ["enabled", "disabled"],
      config: null
    }
  },
  created() {
    // get username
    let username = this.$store.getters.getUser.username
    axios.get("/config/coinbaseconfig").then(data => {
      // init config
      this.config = data.data
      this.setAllDataFieldsFromConfig(this.config)
    })
  },
  methods: {
    setAllDataFieldsFromConfig(config) {
      // update select box
      if (config.useSandbox) {
        this.settings.general.sandboxMode = this.items[0]
      } else {
        this.settings.general.sandboxMode = this.items[1]
      }
      // update fields
      this.settings.production.api.data = config.production.apikey
      this.settings.production.phrase.data = config.production.passphrase
      this.settings.production.secret.data = config.production.secret
      this.settings.sandbox.api.data = config.sandbox.apikey
      this.settings.sandbox.phrase.data = config.sandbox.passphrase
      this.settings.sandbox.secret.data = config.sandbox.secret
    },
    saveChanges() {
      // get select box value
      let sbmode = null
      if (this.settings.general.sandboxMode == this.items[0]) sbmode = true
      else sbmode = false

      // build payload data
      let payload = {
        coinbaseconfig: {
          useSandbox: sbmode,
          sandbox: {
            apikey: this.settings.sandbox.api.data,
            passphrase: this.settings.sandbox.phrase.data,
            secret: this.settings.sandbox.secret.data
          },
          production: {
            apikey: this.settings.production.api.data,
            passphrase: this.settings.production.phrase.data,
            secret: this.settings.production.secret.data
          }
        }
      }
      console.log(payload)
      // send Post with settings payload to backend
      axios.post("/saveSettings", payload).then(data => {
        if (data.data.status == "success") {
          Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            padding: "1.3rem",
            timer: 800,
            timerProgressBar: false
          }).fire({
            icon: "success",
            title: data.data.message
          })
        } else {
          Swal.mixin({
            toast: true,
            position: "top",
            padding: "1.3rem",
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: false
          }).fire({
            icon: "error",
            title: data.data.message
          })
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
.cont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
}
.textColor {
  color: var(--v-primary-base);
  word-break: break-word;
}
.contbottom {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 4%;
}
.paddingTopCont {
  padding-right: 8%;
  padding-left: 8%;
  padding-top: 5%;
  padding-bottom: 5%;
}

.paddingBottomCont {
  padding-right: 4%;
  padding-left: 4%;
  padding-top: 2%;
  padding-bottom: 2%;
}
</style>
