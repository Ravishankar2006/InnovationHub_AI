from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from .db import Base

class StartupProject(Base):
    __tablename__ = "startup_projects"

    id = Column(Integer, primary_key=True, index=True)
    idea = Column(Text, nullable=False)
    status = Column(String, default="created")  # created, processing, completed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    agent_results = relationship("AgentResult", back_populates="project", cascade="all, delete-orphan")

class AgentResult(Base):
    __tablename__ = "agent_results"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("startup_projects.id", ondelete="CASCADE"), nullable=False)
    agent_name = Column(String, nullable=False)  # e.g., "idea_validation"
    result_json = Column(Text, nullable=False)  # JSON-serialized structured output
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    project = relationship("StartupProject", back_populates="agent_results")
