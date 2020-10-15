<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex class="cont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline">
            This is your Home menu
          </v-card-title>

          <v-card-subtitle>
            subtitle
          </v-card-subtitle>

          <v-card-text>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
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
.cont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  max-width: 100vh;
}
</style>
