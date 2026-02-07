-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.classifications (
  id uuid NOT NULL,
  issue_id uuid NOT NULL UNIQUE,
  primary_category character varying,
  primary_confidence double precision NOT NULL,
  detections_json text,
  inference_time_ms double precision NOT NULL,
  model_version character varying NOT NULL,
  created_at timestamp without time zone NOT NULL,
  CONSTRAINT classifications_pkey PRIMARY KEY (id),
  CONSTRAINT classifications_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id)
);
CREATE TABLE public.departments (
  id uuid NOT NULL,
  name character varying NOT NULL UNIQUE,
  code character varying NOT NULL UNIQUE,
  description text,
  categories text,
  default_sla_hours integer NOT NULL,
  escalation_email character varying,
  is_active boolean NOT NULL,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT departments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.escalations (
  id uuid NOT NULL,
  issue_id uuid NOT NULL,
  from_level integer NOT NULL,
  to_level integer NOT NULL,
  reason text NOT NULL,
  escalated_by character varying NOT NULL,
  notified_emails text,
  created_at timestamp without time zone NOT NULL,
  CONSTRAINT escalations_pkey PRIMARY KEY (id),
  CONSTRAINT escalations_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id)
);
CREATE TABLE public.issue_events (
  id uuid NOT NULL,
  issue_id uuid NOT NULL,
  event_type character varying NOT NULL,
  agent_name character varying,
  event_data text,
  created_at timestamp without time zone NOT NULL,
  CONSTRAINT issue_events_pkey PRIMARY KEY (id),
  CONSTRAINT issue_events_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id)
);
CREATE TABLE public.issue_images (
  id uuid NOT NULL,
  issue_id uuid NOT NULL,
  file_path character varying NOT NULL,
  annotated_path character varying,
  original_filename character varying,
  created_at timestamp without time zone NOT NULL,
  CONSTRAINT issue_images_pkey PRIMARY KEY (id),
  CONSTRAINT issue_images_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id)
);
CREATE TABLE public.issues (
  id uuid NOT NULL,
  description text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  accuracy_meters double precision,
  state character varying NOT NULL,
  priority integer,
  priority_reason text,
  validation_source character varying,
  validation_reason text,
  is_duplicate boolean NOT NULL,
  parent_issue_id uuid,
  geo_cluster_id character varying,
  platform character varying NOT NULL,
  device_model character varying,
  department_id uuid,
  assigned_member_id uuid,
  city character varying,
  locality character varying,
  full_address text,
  sla_deadline timestamp without time zone,
  sla_hours integer,
  escalation_level integer NOT NULL,
  escalated_at timestamp without time zone,
  resolved_at timestamp without time zone,
  resolution_notes text,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  user_id character varying,
  proof_image_path character varying,
  completed_at timestamp without time zone,
  CONSTRAINT issues_pkey PRIMARY KEY (id),
  CONSTRAINT issues_parent_issue_id_fkey FOREIGN KEY (parent_issue_id) REFERENCES public.issues(id),
  CONSTRAINT issues_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT issues_assigned_member_id_fkey FOREIGN KEY (assigned_member_id) REFERENCES public.members(id)
);
CREATE TABLE public.members (
  id uuid NOT NULL,
  department_id uuid,
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  phone character varying,
  role character varying NOT NULL,
  city character varying,
  locality character varying,
  is_active boolean NOT NULL,
  current_workload integer NOT NULL,
  max_workload integer NOT NULL,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  password_hash character varying,
  CONSTRAINT members_pkey PRIMARY KEY (id),
  CONSTRAINT members_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id)
);