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
            :append-icon="showPasswords.pApi ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswords.pApi ? 'text' : 'password'"
            @click:append="showPasswords.pApi = !showPasswords.pApi"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Passphrase"
            hide-details="auto"
            :append-icon="showPasswords.pPhrase ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswords.pPhrase ? 'text' : 'password'"
            @click:append="showPasswords.pPhrase = !showPasswords.pPhrase"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Secret"
            hide-details="auto"
            :append-icon="showPasswords.pSecret ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswords.pSecret ? 'text' : 'password'"
            @click:append="showPasswords.pSecret = !showPasswords.pSecret"
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
            :append-icon="showPasswords.sApi ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswords.sApi ? 'text' : 'password'"
            @click:append="showPasswords.sApi = !showPasswords.sApi"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Passphrase"
            hide-details="auto"
            :append-icon="showPasswords.sPhrase ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswords.sPhrase ? 'text' : 'password'"
            @click:append="showPasswords.sPhrase = !showPasswords.sPhrase"
          ></v-text-field>

          <v-text-field
            class="paddingTopCont"
            label="Secret"
            hide-details="auto"
            :append-icon="showPasswords.sSecret ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswords.sSecret ? 'text' : 'password'"
            @click:append="showPasswords.sSecret = !showPasswords.sSecret"
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
export default {
  data() {
    return {
      inputRules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      showPasswords: {
        pApi: true,
        pPhrase: false,
        pSecret: false,
        sApi: true,
        sPhrase: false,
        sSecret: false
      },
      items: ["enabled", "disabled"]
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
