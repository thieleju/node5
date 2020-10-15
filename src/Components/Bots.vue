<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex class="leftCont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline">
            Node5 App
          </v-card-title>

          <v-card-subtitle>
            Subtitle
          </v-card-subtitle>

          <v-card-text>
            This is Card Text
          </v-card-text>

          <v-card-actions>
            <v-btn text color="accent">
              Alright Button
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex class="rightCont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline">
            Node5 App
          </v-card-title>

          <v-card-subtitle>
            Subtitle
          </v-card-subtitle>

          <v-card-text>
            This is Card Text
          </v-card-text>

          <v-card-actions>
            <v-btn text color="accent">
              Alright Button
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {}
</script>

<style lang="css" scoped>
.leftCont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  max-width: 150vh;
}
.rightCont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  max-width: 50vh;
}
</style>
