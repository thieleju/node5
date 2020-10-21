<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex class="cont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline">
            Coinbase Production Settings
          </v-card-title>

          <v-text-field
            class="paddingTopCont"
            label="API Key"
            hide-details="auto"
            :append-icon="production.api.showpass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="production.api.showpass ? 'text' : 'password'"
            @click:append="production.api.showpass = !production.api.showpass"
            v-model="production.api.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Passphrase"
            hide-details="auto"
            :append-icon="
              production.phrase.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="production.phrase.showpass ? 'text' : 'password'"
            @click:append="
              production.phrase.showpass = !production.phrase.showpass
            "
            v-model="production.phrase.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Secret"
            hide-details="auto"
            :append-icon="
              production.secret.showpass ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="production.secret.showpass ? 'text' : 'password'"
            @click:append="
              production.secret.showpass = !production.secret.showpass
            "
            v-model="production.secret.data"
          ></v-text-field>

          <v-card-actions>
            <v-btn text color="accent">
              Save changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex class="cont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline">
            Coinbase Sandbox Settings
          </v-card-title>

          <v-text-field
            class="paddingTopCont"
            label="API Key"
            hide-details="auto"
            :append-icon="sandbox.api.showpass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="sandbox.api.showpass ? 'text' : 'password'"
            @click:append="sandbox.api.showpass = !sandbox.api.showpass"
            v-model="sandbox.api.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Passphrase"
            hide-details="auto"
            :append-icon="sandbox.phrase.showpass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="sandbox.phrase.showpass ? 'text' : 'password'"
            @click:append="sandbox.phrase.showpass = !sandbox.phrase.showpass"
            v-model="sandbox.phrase.data"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Secret"
            hide-details="auto"
            :append-icon="sandbox.secret.showpass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="sandbox.secret.showpass ? 'text' : 'password'"
            @click:append="sandbox.secret.showpass = !sandbox.secret.showpass"
            v-model="sandbox.secret.data"
          ></v-text-field>

          <v-card-actions>
            <v-btn text color="accent">
              Save changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout column>
      <v-flex class="cont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline">
            General Settings
          </v-card-title>

          <v-select
            class="paddingBottomCont"
            :items="items"
            label="Sandbox Mode"
          ></v-select>

          <v-card-actions>
            <v-btn text color="accent">
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

export default {
  data() {
    return {
      inputRules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
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
      },
      items: ["enabled", "disabled"],
      config: null
    }
  },
  created() {
    // get username
    let username = this.$store.getters.getUser.username
    axios
      .get(this.$store.getters.getAPIUrl + "/config/coinbaseconfig")
      .then(data => {
        // init config
        this.config = data.data
        this.setAllDataFieldsFromConfig(this.config)
      })
  },
  methods: {
    setAllDataFieldsFromConfig(config) {
      this.production.api.data = config.production.apikey
      this.production.phrase.data = config.production.passphrase
      this.production.secret.data = config.production.secret
      this.sandbox.api.data = config.sandbox.apikey
      this.sandbox.phrase.data = config.sandbox.passphrase
      this.sandbox.secret.data = config.sandbox.secret
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
}
.miniCont {
  max-width: 30vh;
}
.paddingTopCont {
  padding-right: 8%;
  padding-left: 8%;
  padding-top: 3%;
  padding-bottom: 3%;
}

.paddingBottomCont {
  padding-right: 4%;
  padding-left: 4%;
  padding-top: 2%;
  padding-bottom: 2%;
}
</style>
