# Forensic OSINT Report Generator - API Documentation

## Overview

The Forensic OSINT Report Generator provides a comprehensive API for creating and managing forensic investigation cases, including webhook endpoints for external data integration.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://your-domain.manus.space`

## Authentication

The application uses Manus OAuth for user authentication. Most tRPC endpoints require authentication, while webhook endpoints are public (should be secured with API keys in production).

## Webhook Endpoints

### 1. Create Case via Webhook

**Endpoint:** `POST /api/webhook/case`

**Description:** Creates a new forensic investigation case with entities, theories, and timeline events from an external source.

**Request Body:**

```json
{
  "userId": 1,
  "title": "The Disappearance of Brian Shaffer",
  "subject": "Brian Randall Shaffer",
  "dateOfIncident": "2006-04-01T01:55:00Z",
  "location": "Ugly Tuna Saloona, Columbus, Ohio",
  "description": "Brian Shaffer, a 27-year-old medical student, disappeared after entering a bar and was never seen leaving on security footage.",
  "entities": [
    {
      "entityType": "person",
      "name": "Brian Randall Shaffer",
      "description": "Missing person, 27-year-old medical student",
      "metadata": "{\"age\": 27, \"occupation\": \"Medical Student\"}"
    },
    {
      "entityType": "location",
      "name": "Ugly Tuna Saloona",
      "description": "Bar on 2nd Floor, 1546 N. High St., Columbus, OH",
      "metadata": "{\"address\": \"1546 N. High St., Columbus, OH\"}"
    },
    {
      "entityType": "company",
      "name": "Turner Construction",
      "description": "General Contractor for South Campus Gateway project",
      "metadata": "{\"role\": \"Construction Contractor\"}"
    }
  ],
  "theories": [
    {
      "title": "Exit via Unmonitored Route",
      "description": "Brian Shaffer exited via an unmonitored service door into the Turner Construction site.",
      "probability": 85,
      "verificationFormula": "(Entrance Confirmed) + (Exit Not Confirmed) + (Unmonitored Exit Exists) = TRUE"
    },
    {
      "title": "Foul Play Inside Venue",
      "description": "Brian was the victim of foul play inside the bar, and his body was concealed.",
      "probability": 10,
      "verificationFormula": "(Entrance Confirmed) + (Exit Not Confirmed) + (Body Concealment/Removal) = FALSE"
    }
  ],
  "timelineEvents": [
    {
      "eventTime": "2006-03-31T21:00:00Z",
      "eventDescription": "Shaffer meets Clint Florence",
      "significance": "Start of the evening, establishing the last known associate"
    },
    {
      "eventTime": "2006-04-01T01:15:00Z",
      "eventDescription": "Shaffer, Florence, and Meredith Reed arrive at Ugly Tuna Saloona",
      "significance": "Confirmed entry via the main escalator/entrance, captured on camera"
    },
    {
      "eventTime": "2006-04-01T01:55:00Z",
      "eventDescription": "Shaffer is seen on camera talking to two women outside the main entrance, then re-enters the bar",
      "significance": "The last confirmed sighting of Brian Shaffer"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "caseId": 1,
  "message": "Case created successfully via webhook"
}
```

**Error Responses:**

- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error during case creation

### 2. Webhook Health Check

**Endpoint:** `GET /api/webhook/health`

**Description:** Check the health status of the webhook API.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-25T14:30:00.000Z"
}
```

## tRPC API Endpoints

The application uses tRPC for type-safe API calls. Below are the available procedures:

### Cases

- `cases.list`: Get all cases for the current user
- `cases.create`: Create a new case
- `cases.getById`: Get a case by ID
- `cases.update`: Update a case
- `cases.delete`: Delete a case

### Entities

- `entities.list`: Get all entities for a case
- `entities.create`: Create a new entity
- `entities.update`: Update an entity
- `entities.delete`: Delete an entity

### Theories

- `theories.list`: Get all theories for a case
- `theories.create`: Create a new theory
- `theories.update`: Update a theory
- `theories.delete`: Delete a theory

### Reports

- `reports.list`: Get all reports for a case
- `reports.generate`: Generate a new report for a case
- `reports.getById`: Get a report by ID

## Data Models

### Entity Types

- `person`: Individuals involved in the case
- `location`: Physical locations related to the case
- `company`: Companies or organizations
- `disposal_site`: Potential disposal or concealment sites
- `exit_route`: Exit routes or pathways
- `other`: Other entity types

### Theory Status

- `verified`: Theory has been verified through evidence
- `eliminated`: Theory has been eliminated through process of elimination
- `pending`: Theory is still under investigation

### Case Status

- `draft`: Case is in draft mode
- `in_progress`: Case investigation is ongoing
- `completed`: Case investigation is completed

## Integration Examples

### Python Example

```python
import requests
import json

url = "http://localhost:3000/api/webhook/case"
payload = {
    "userId": 1,
    "title": "Investigation Case",
    "subject": "Subject Name",
    "description": "Case description",
    "entities": [
        {
            "entityType": "person",
            "name": "John Doe",
            "description": "Person of interest"
        }
    ]
}

response = requests.post(url, json=payload)
print(response.json())
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/webhook/case \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Investigation Case",
    "subject": "Subject Name",
    "description": "Case description"
  }'
```

## Security Considerations

**Important:** In production, webhook endpoints should be secured with:

1. **API Keys:** Implement API key authentication for webhook endpoints
2. **IP Whitelisting:** Restrict webhook access to known IP addresses
3. **Request Signing:** Implement HMAC-based request signing
4. **Rate Limiting:** Add rate limiting to prevent abuse

## Report Generation

The application automatically generates comprehensive forensic OSINT reports in Markdown format, including:

- Executive Summary
- Case Timeline
- Entity Map
- Relationship Analysis
- Theories and Probability Assessment
- Maltego-style Graph Data (JSON format)

Reports can be downloaded as Markdown files and converted to PDF using external tools.

## Support

For technical support or questions about the API, please refer to the project documentation or contact the development team.

