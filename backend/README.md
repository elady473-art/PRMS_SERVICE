# PRMS — Purchase Requisition Management System

PRMS is a Spring Boot microservice for managing an ERP procurement lifecycle:

```text
Purchase requisition → approval → RFQ/quotation → purchase order → goods receipt → invoice
```

It integrates with:

- MMS (Materials Management System) for inventory availability checks.
- FMS (Finance Management System) for budget checks and invoice submission.
- HRM (Human Resource Management) for employee and approver information.

## Technology

| Area | Technology |
| --- | --- |
| Language | Java 17 source compatibility |
| Framework | Spring Boot 3.3.x |
| Persistence | Spring Data JPA |
| Database driver | PostgreSQL |
| Security | Spring Security OAuth2 Resource Server with JWT |
| Messaging | RabbitMQ through Spring AMQP |
| Service calls | Spring `RestClient` |
| DTO mapping | MapStruct |
| API documentation | springdoc OpenAPI / Swagger UI |
| Validation | Jakarta Bean Validation |
| Boilerplate reduction | Lombok |

## Project layout

```text
com.erp.prms
├── PrmsApplication.java
├── config
├── controller
├── dto
│   ├── request
│   └── response
├── entity
│   ├── base
│   └── enums
├── exception
├── mapper
├── repository
│   └── custom
├── scheduler
├── service
│   ├── requisition
│   ├── procurement
│   ├── vendor
│   ├── rfp
│   ├── receiving
│   ├── approval
│   ├── integration
│   └── events
├── util
└── validator
```

`PrmsApplication` is the application entry point. It enables Spring Boot auto-configuration, Feign client scanning, async execution, and scheduled jobs.

## Configuration

The project reads these properties. Defaults are supplied for local development where shown.

| Property | Purpose | Default |
| --- | --- | --- |
| `spring.datasource.url` | PRMS database JDBC URL | Required for runtime |
| `spring.datasource.username` | Database user | Required for runtime |
| `spring.datasource.password` | Database password | Required for runtime |
| `spring.jpa.hibernate.ddl-auto` | JPA schema strategy | Recommended: `validate` or migration-managed |
| `spring.security.oauth2.resourceserver.jwt.issuer-uri` | JWT issuer used to validate access tokens | Required for protected runtime APIs |
| `spring.rabbitmq.host` | RabbitMQ broker host | `localhost` |
| `spring.rabbitmq.port` | RabbitMQ broker port | `5672` |
| `spring.rabbitmq.username` | RabbitMQ username | `guest` |
| `spring.rabbitmq.password` | RabbitMQ password | `guest` |
| `integration.mms.base-url` | MMS base URL | `http://localhost:8081` |
| `integration.fms.base-url` | FMS base URL | `http://localhost:8082` |
| `integration.hrm.base-url` | HRM base URL | `http://localhost:8083` |
| `prms.scheduling.purchase-order-expiry-cron` | PO expiry job schedule | Daily at 01:00 |
| `prms.scheduling.vendor-performance-cron` | Vendor score job schedule | First day of month at 02:00 |

Example `application.yml` for a local PostgreSQL environment:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/prms
    username: prms_user
    password: change-me
  jpa:
    hibernate:
      ddl-auto: validate
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://identity.example.com/realms/erp
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

integration:
  mms:
    base-url: http://localhost:8081
  fms:
    base-url: http://localhost:8082
  hrm:
    base-url: http://localhost:8083
```

## Configuration classes

| Class | Responsibility |
| --- | --- |
| `SecurityConfig` | Configures stateless JWT authentication. Swagger, OpenAPI, and health URLs are public; all other endpoints require authentication. |
| `SwaggerConfig` | Supplies API title, version, description, and JWT bearer authentication scheme to OpenAPI. |
| `RabbitMQConfig` | Configures a JSON RabbitMQ exchange, queue, and RabbitTemplate. |
| `AsyncConfig` | Provides a bounded executor named `prmsTaskExecutor`. |
| `AuditConfig` | Enables JPA auditing and records the authenticated username, or `system` when no user is available. |

Swagger UI is exposed at `/swagger-ui/index.html` when the application is running.

## Domain model

Every entity inherits `BaseEntity`, which contains:

- `id`: generated primary key.
- `createdAt`, `createdBy`: creation audit values.
- `updatedAt`, `updatedBy`: update audit values.
- `version`: optimistic-lock version.

| Entity | Purpose |
| --- | --- |
| `PurchaseRequisition` | Initial request to buy goods or services. Stores requester, department, purpose, estimated amount, status, required date, item details, and approval workflow. |
| `PurchaseOrder` | Vendor-facing order made from one approved requisition. Stores vendor, amount, payment terms, dates, status, and item details. |
| `Vendor` | Supplier master record with type, tax ID, contacts, payment terms, blacklist status, and performance score. |
| `VendorContact` | Contact person belonging to a vendor. |
| `RFQ` | Request for quotation connected to a requisition and quotation deadline. |
| `Quotation` | Vendor response to an RFQ. |
| `QuotationItem` | Normalized item and price line inside a quotation. |
| `ProcurementContract` | Vendor agreement optionally linked to one purchase order. |
| `GoodsReceiptNote` | Record of received goods against a PO. |
| `Invoice` | Vendor invoice for a PO, processed through FMS. |
| `ApprovalWorkflow` | Ordered approval process for a requisition. |
| `ApprovalStage` | One approver's stage, decision, comments, and decision time. |

The approved entity structure intentionally does not include `PurchaseRequisitionItem` or `PurchaseOrderItem`. Therefore, item lines for requisitions, POs, RFQs, goods receipts, and invoices are stored in `itemDetails` or `receiptDetails` as JSON text. Quotation lines use the supplied normalized `QuotationItem` entity.

### Enums

| Enum | Values |
| --- | --- |
| `PRStatus` | `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `PO_CREATED` |
| `POStatus` | `DRAFT`, `SENT`, `CONFIRMED`, `PARTIALLY_RECEIVED`, `COMPLETED`, `CANCELLED` |
| `VendorType` | `INDIVIDUAL`, `CORPORATE`, `GOVERNMENT` |
| `PaymentTerms` | `NET_15`, `NET_30`, `NET_60`, `COD` |
| `ApprovalAction` | `APPROVE`, `REJECT`, `RETURN` |

All money values are `BigDecimal`.

## Repositories

Each aggregate has a Spring Data JPA repository for CRUD and domain searches:

- `PurchaseRequisitionRepository`
- `PurchaseOrderRepository`
- `VendorRepository`
- `RFQRepository`
- `QuotationRepository`
- `GoodsReceiptNoteRepository`
- `InvoiceRepository`
- `ApprovalWorkflowRepository`

`PurchaseOrderRepository` also implements `PurchaseOrderCustomRepository`. Its native query returns a vendor's actionable POs with `SENT`, `CONFIRMED`, or `PARTIALLY_RECEIVED` status.

## DTOs and validation

Request DTOs define the accepted write payloads and validate required fields, dates, amounts, IDs, and email values:

- `RequisitionCreateRequest`
- `RequisitionApproveRequest`
- `PurchaseOrderCreateRequest`
- `VendorCreateRequest`
- `RFQCreateRequest`
- `GoodsReceiptRequest`
- `InvoiceRequest`

Response DTOs avoid exposing JPA internals where response models are defined:

- `RequisitionResponse`
- `PurchaseOrderResponse`
- `VendorResponse`
- `BudgetCheckResponse` from FMS
- `InventoryCheckResponse` from MMS

`PurchaseRequisitionMapper`, `PurchaseOrderMapper`, `VendorMapper`, and `RFQMapper` convert between the API and persistence models. Generated identifiers, audit fields, relationships, and statuses are not accepted from create requests.

## Services

### Domain services

| Service | Responsibility |
| --- | --- |
| `RequisitionService` | Creates drafts, retrieves requisitions, lists a requester's requisitions, validates budget, and submits for approval. |
| `ProcurementService` | Creates POs only from approved requisitions, validates vendor policy, assigns PO number, and emits a PO event. |
| `VendorService` | Registers, retrieves, and lists active vendors. |
| `RFQService` | Creates and retrieves RFQs. |
| `GoodsReceiptService` | Records and retrieves receipts; accepted receipts mark their PO as partially received. |
| `ApprovalWorkflowService` | Validates the current approver and applies approve, reject, or return actions. |

Every domain service has an interface and a constructor-injected implementation in its `impl` subpackage.

### Integration services

| Service | External system | Behavior |
| --- | --- | --- |
| `InventoryIntegrationService` | MMS | Calls `/api/inventory/check` with item code and quantity. |
| `FinanceIntegrationService` | FMS | Calls `/api/budgets/check`; persists invoice submissions for FMS processing. |
| `HrmIntegrationService` | HRM | Retrieves employee data from `/api/employees/{employeeId}`. |

The fixed structure has no `InvoiceService`. Therefore, `InvoiceController` delegates directly to `FinanceIntegrationService`. `ProcurementContract` is intentionally an entity without a dedicated service or controller.

### Events

`ProcurementEventPublisher` publishes procurement event payloads to the configured RabbitMQ exchange and routing key. The requisition and PO services currently emit events when a requisition is submitted and a PO is created.

## REST API

All protected endpoints require a bearer JWT.

| Method | Endpoint | Operation |
| --- | --- | --- |
| `POST` | `/api/v1/requisitions` | Create a draft requisition. |
| `GET` | `/api/v1/requisitions/{id}` | Get one requisition. |
| `GET` | `/api/v1/requisitions?requesterEmployeeId={id}` | List a requester's requisitions. |
| `POST` | `/api/v1/requisitions/{id}/submit` | Check budget and submit for approval. |
| `POST` | `/api/v1/purchase-orders` | Create a PO from an approved requisition. |
| `GET` | `/api/v1/purchase-orders/{id}` | Get one PO. |
| `POST` | `/api/v1/vendors` | Register a vendor. |
| `GET` | `/api/v1/vendors/{id}` | Get one vendor. |
| `GET` | `/api/v1/vendors` | List active vendors. |
| `POST` | `/api/v1/rfqs` | Create an RFQ. |
| `GET` | `/api/v1/rfqs/{id}` | Get one RFQ. |
| `POST` | `/api/v1/goods-receipts` | Record received goods. |
| `GET` | `/api/v1/goods-receipts/{id}` | Get one goods receipt. |
| `POST` | `/api/v1/invoices` | Submit a vendor invoice. |
| `POST` | `/api/v1/approvals/requisitions/{id}` | Submit the current authenticated approver's decision. |

## Procurement workflow

1. A requester creates a draft purchase requisition.
2. The requester submits it; PRMS checks the departmental budget with FMS.
3. An assigned approval workflow processes approver decisions.
4. After final approval, procurement creates a PO using an active, non-blacklisted vendor.
5. Procurement can issue an RFQ and receive vendor quotations.
6. Receiving records delivered goods against the PO.
7. Finance submits and processes the vendor invoice through the FMS integration boundary.

## Validation and policy

- `BudgetValidator` calls FMS and throws `BudgetExceededException` if funds are not approved.
- `ProcurementPolicyValidator` rejects blacklisted vendors and non-positive procurement amounts.
- Request DTOs use `@Valid`, `@NotNull`, `@NotBlank`, `@DecimalMin`, and date constraints.

## Errors

`GlobalExceptionHandler` maps errors to RFC 9457-style `ProblemDetail` responses:

| Error type | HTTP status |
| --- | --- |
| Missing resource | `404 Not Found` |
| Budget, vendor blacklist, or approval conflict | `409 Conflict` |
| Invalid request or invalid state | `400 Bad Request` |
| Bean-validation failure | `400 Bad Request` with a `violations` object |

## Utilities and scheduled jobs

| Component | Purpose |
| --- | --- |
| `PRGenerator` | Produces PR numbers such as `PR-2026-0001`. |
| `POGenerator` | Produces PO numbers such as `PO-2026-0001`. |
| `ApprovalChainBuilder` | Creates ordered approval stages from employee IDs. |
| `PurchaseOrderExpiryScheduler` | Runs daily and cancels expired POs in `SENT` status. |
| `VendorPerformanceScheduler` | Runs monthly and recalculates active vendor scores from PO status outcomes. |

## Build and run

Prerequisites:

- JDK 17 or newer.
- Maven 3.9 or newer.
- PostgreSQL.
- RabbitMQ for event publishing.
- Reachable or stubbed MMS, FMS, and HRM endpoints.
- A JWT issuer configured for the resource server.

Compile:

```bash
mvn clean compile
```

Run:

```bash
mvn spring-boot:run
```

Package:

```bash
mvn clean package
```

## Production recommendations

- Add Flyway or Liquibase migrations before managing production schema changes.
- Replace in-memory PR/PO counters with database-backed sequences or a dedicated numbering service to avoid duplicate numbers across instances.
- Add retry, timeout, circuit-breaker, and error-translation policies to MMS, FMS, and HRM calls.
- Define concrete RFQ, quotation, receipt, and invoice response DTOs before exposing those entities externally in a production API.
- Add authorization rules based on JWT roles and department ownership.
- Add automated unit, integration, security, and API-contract tests.
- Use a transactional outbox pattern for reliable RabbitMQ event delivery.
