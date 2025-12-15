<template>
  <div id="app">
    <!-- <h1>Générateur de QR Code</h1> -->
    <QRCodeGenerator />
  </div>
</template>

<script>
import QRCodeGenerator from './components/QRCodeGenerator.vue'

export default {
  components: {
    QRCodeGenerator
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 40px;
}
</style>
