from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "USER"
    AGENT = "AGENT"
    ADMIN = "ADMIN"
    DISTRICT_OFFICER = "DISTRICT_OFFICER"
    STATE_OFFICER = "STATE_OFFICER"
    MINISTRY = "MINISTRY"

class EventType(str, Enum):
    SCHEME_VIEWED = "scheme_viewed"
    LESSON_COMPLETED = "lesson_completed"
    IVR_CALL_COMPLETED = "ivr_call_completed"
    WHATSAPP_INTERACTION = "whatsapp_interaction"
    APPLICATION_STARTED = "application_started"
    APPLICATION_SUBMITTED = "application_submitted"
    APPLICATION_APPROVED = "application_approved"
    APPLICATION_REJECTED = "application_rejected"
    BENEFIT_DELIVERED = "benefit_delivered"
    DOCUMENT_SCANNED = "document_scanned"
    FORM_FILLED = "form_filled"
    AGENT_ASSISTED = "agent_assisted"
    REMINDER_SENT = "reminder_sent"
    STATUS_CHECKED = "status_checked"

class Channel(str, Enum):
    WEB = "web"
    MOBILE = "mobile"
    IVR = "ivr"
    WHATSAPP = "whatsapp"
    AGENT_ASSISTED = "agent_assisted"
    SMS = "sms"

class AgentType(str, Enum):
    CSC_OPERATOR = "csc_operator"
    SHG_LEADER = "shg_leader"
    ASHA_WORKER = "asha_worker"
    NGO_VOLUNTEER = "ngo_volunteer"
    PANCHAYAT_WORKER = "panchayat_worker"

class Village(BaseModel):
    village_code: str = Field(..., description="Unique Census-style code (e.g., 001001001)")
    village_name: str
    block_code: str
    block_name: str
    district_code: str
    district_name: str
    state_code: str
    state_name: str
    pin_code: Optional[str] = None
    population: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VillageResponse(Village):
    id: str

# ============= AGENT MANAGEMENT =============

class AgentCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    phone: str = Field(..., min_length=10, max_length=15)
    agent_type: AgentType
    assigned_villages: List[str] = Field(default=[], description="List of village codes")
    id_proof_number: str = Field(..., description="Aadhaar/PAN/Other ID")
    address: str

class AgentResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str
    agent_type: str
    assigned_villages: List[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    performance_score: Optional[float] = 0.0
    total_assisted: Optional[int] = 0

class AgentUpdate(BaseModel):
    assigned_villages: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

# ============= EVENT TRACKING =============

class EventLog(BaseModel):
    user_id: Optional[str] = None
    agent_id: Optional[str] = None
    village_code: str
    scheme_id: Optional[str] = None
    event_type: EventType
    channel: Channel
    metadata: Optional[Dict] = Field(default={})
    geo_location: Optional[Dict] = Field(default=None, description="lat, lon, accuracy, method")
    session_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class EventLogResponse(EventLog):
    id: str

# ============= SCHEME APPLICATIONS =============

class SchemeApplicationCreate(BaseModel):
    scheme_id: str
    user_id: str
    village_code: str
    agent_id: Optional[str] = None
    documents: List[Dict] = Field(default=[], description="List of uploaded documents")
    form_data: Dict = Field(default={})
    channel: Channel

class SchemeApplicationResponse(BaseModel):
    id: str
    scheme_id: str
    user_id: str
    village_code: str
    agent_id: Optional[str]
    status: str  # pending, approved, rejected, delivered
    rejection_reason: Optional[str] = None
    submitted_at: datetime
    approved_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    processing_time_days: Optional[int] = None

class ApplicationStatusUpdate(BaseModel):
    status: str
    rejection_reason: Optional[str] = None
    remarks: Optional[str] = None

# ============= AGENT ACTIONS =============

class AgentAction(BaseModel):
    agent_id: str
    user_id: str
    village_code: str
    scheme_id: Optional[str] = None
    action_type: str  # assisted, scanned, submitted, checked_status
    geo_location: Optional[Dict] = None
    metadata: Optional[Dict] = Field(default={})
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AgentActionResponse(AgentAction):
    id: str

# ============= ANALYTICS =============

class VillageMetrics(BaseModel):
    village_code: str
    village_name: str
    district_name: str
    scheme_id: str
    scheme_name: str
    awareness_percentage: float
    application_count: int
    approval_count: int
    rejection_count: int
    approval_rate: float
    avg_processing_days: Optional[float] = None
    top_rejection_reason: Optional[str] = None

class DistrictMetrics(BaseModel):
    district_code: str
    district_name: str
    total_villages: int
    active_users: int
    total_applications: int
    total_approvals: int
    approval_rate: float
    agent_count: int
    avg_agent_performance: Optional[float] = None

class SchemePerformance(BaseModel):
    scheme_id: str
    scheme_name: str
    total_views: int
    total_applications: int
    total_approvals: int
    conversion_rate: float  # views to applications
    success_rate: float  # applications to approvals
    avg_processing_days: float
    top_districts: List[Dict]

class AgentScorecard(BaseModel):
    agent_id: str
    agent_name: str
    villagers_assisted: int
    applications_submitted: int
    applications_approved: int
    approval_rate: float
    avg_completion_time_hours: float
    performance_score: float
    last_activity: datetime
    fraud_flags: int

class InsightAlert(BaseModel):
    alert_type: str  # documentation_confusion, eligibility_issue, agent_bottleneck, delay
    severity: str  # low, medium, high, critical
    entity_type: str  # village, agent, scheme, district
    entity_id: str
    entity_name: str
    description: str
    metrics: Dict
    suggested_action: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GovernmentDashboardStats(BaseModel):
    total_villages: int
    active_villages: int
    total_users: int
    total_agents: int
    total_schemes: int
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
    overall_approval_rate: float
    avg_processing_days: float
    alerts_count: int

# ============= INCENTIVE SYSTEM =============

class IncentiveRecord(BaseModel):
    agent_id: str
    application_id: str
    scheme_id: str
    incentive_amount: float
    incentive_type: str  # fixed, performance_bonus, milestone
    status: str  # pending, approved, paid
    approved_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class IncentiveResponse(IncentiveRecord):
    id: str
    agent_name: str
    scheme_name: str
