import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

// JSON Schema for validating product response
const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    price: { type: 'number' },
    category: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['id', 'title', 'price', 'category', 'description'],
  additionalProperties: true,
};

test.describe('Fake Store API Tests', () => {
  const API_URL = 'https://fakestoreapi.com/products/1';

  test('GET /products/1 - Should return 200 status and validate product data', async ({ request }) => {
    // Step 1: Send GET request to the endpoint
    const response = await request.get(API_URL);

    // Step 2: Verify response status is 200
    expect(response.status()).toBe(200);
    console.log(`✓ Response status: ${response.status()}`);

    // Parse response JSON
    const responseBody = await response.json();

    // Step 3: Validate response contains required keys
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('title');
    expect(responseBody).toHaveProperty('price');
    expect(responseBody).toHaveProperty('category');
    expect(responseBody).toHaveProperty('description');
    console.log('✓ All required keys are present in response');

    // Step 4: Validate data types using JSON Schema (Ajv)
    const ajv = new Ajv();
    const validate = ajv.compile(productSchema);
    const isValid = validate(responseBody);

    if (!isValid) {
      console.error('Schema validation errors:', validate.errors);
    }
    expect(isValid).toBe(true);
    console.log('✓ Response data passes JSON schema validation');

    // Step 5: Log product title and price to console
    console.log(`\n📦 Product Details:`);
    console.log(`   Title: ${responseBody.title}`);
    console.log(`   Price: $${responseBody.price}`);
    console.log(`   Category: ${responseBody.category}`);
    console.log(`   Description: ${responseBody.description}\n`);

    // Additional assertions for data integrity
    expect(responseBody.id).toBe(1);
    expect(typeof responseBody.title).toBe('string');
    expect(typeof responseBody.price).toBe('number');
    expect(responseBody.price).toBeGreaterThan(0);
    expect(typeof responseBody.category).toBe('string');
    expect(typeof responseBody.description).toBe('string');
  });

  test('GET /products/1 - Validate response structure in detail', async ({ request }) => {
    const response = await request.get(API_URL);
    
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Verify all required fields exist and have correct types
    expect(responseBody.id).toBeDefined();
    expect(responseBody.title).toBeDefined();
    expect(responseBody.price).toBeDefined();
    expect(responseBody.category).toBeDefined();
    expect(responseBody.description).toBeDefined();

    // Validate string fields are not empty
    expect(responseBody.title.length).toBeGreaterThan(0);
    expect(responseBody.category.length).toBeGreaterThan(0);
    expect(responseBody.description.length).toBeGreaterThan(0);

    console.log('✓ All validations passed for response structure');
  });
});
