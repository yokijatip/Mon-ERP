<script setup lang="ts">
import { ref } from 'vue'
import { useFirestore } from '@/composables/useFirestore'
import { useCollection } from '@/composables/useCollection'
import { useNumbering } from '@/composables/useNumbering'
import { Timestamp } from 'firebase/firestore'
import type { Product } from '@/types/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const testResults = ref<string[]>([])

const addResult = (message: string, success = true) => {
  const icon = success ? '✅' : '❌'
  testResults.value.push(`${icon} ${message}`)
}

// Test 1: useFirestore - Create
const testCreate = async () => {
  try {
    const { create } = useFirestore<Product>('products')

    const id = await create({
      sku: `TEST-${Date.now()}`,
      name: 'Test Product',
      description: 'Created from test',
      category: 'Test',
      hasVariants: false,
      cost: 1000,
      price: 1500,
      trackInventory: true,
      unit: 'pcs',
      images: [],
      isActive: true,
      isSellable: true,
      isPurchasable: true
    } as any)

    addResult(`Created product with ID: ${id}`)
  } catch (error: any) {
    addResult(`Create failed: ${error.message}`, false)
  }
}

// Test 2: useFirestore - Read
const testRead = async () => {
  try {
    const { getAll } = useFirestore<Product>('products')
    const products = await getAll()
    addResult(`Found ${products.length} products`)
  } catch (error: any) {
    addResult(`Read failed: ${error.message}`, false)
  }
}

// Test 3: useNumbering
const testNumbering = async () => {
  try {
    const { generateNumber, previewNextNumber } = useNumbering()

    const preview = await previewNextNumber('invoice')
    addResult(`Preview next invoice: ${preview}`)

    const actual = await generateNumber('invoice')
    addResult(`Generated invoice: ${actual}`)
  } catch (error: any) {
    addResult(`Numbering failed: ${error.message}`, false)
  }
}

// Test 4: useCollection (real-time)
const { data: products, loading } = useCollection<Product>('products')

const runAllTests = async () => {
  testResults.value = []
  addResult('Starting tests...')

  await testCreate()
  await testRead()
  await testNumbering()

  addResult('All tests completed!')
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold">Composables Testing</h1>

    <!-- Test Controls -->
    <Card>
      <CardHeader>
        <CardTitle>Test Controls</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <Button @click="runAllTests" class="w-full">
          Run All Tests
        </Button>
        <Button @click="testCreate" variant="outline" class="w-full">
          Test Create
        </Button>
        <Button @click="testRead" variant="outline" class="w-full">
          Test Read
        </Button>
        <Button @click="testNumbering" variant="outline" class="w-full">
          Test Numbering
        </Button>
      </CardContent>
    </Card>

    <!-- Test Results -->
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="testResults.length === 0" class="text-muted-foreground">
          No tests run yet
        </div>
        <div v-else class="space-y-1">
          <div v-for="(result, index) in testResults" :key="index" class="font-mono text-sm">
            {{ result }}
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Real-time Products -->
    <Card>
      <CardHeader>
        <CardTitle>Real-time Products (useCollection)</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading">Loading...</div>
        <div v-else-if="products.length === 0" class="text-muted-foreground">
          No products yet
        </div>
        <div v-else class="space-y-2">
          <div v-for="product in products" :key="product.id"
               class="p-3 border rounded">
            <div class="font-semibold">{{ product.name }}</div>
            <div class="text-sm text-muted-foreground">
              SKU: {{ product.sku }} | Price: Rp {{ product.price?.toLocaleString() }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>