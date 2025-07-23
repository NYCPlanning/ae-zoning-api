-- Agency dropdown filtered to those with community board budget requests
SELECT
	agency.initials,
	agency.name
FROM agency
LEFT JOIN agency_needs_group ON
		agency_needs_group.agency_initials = agency.initials
LEFT JOIN needs_group ON
		needs_group.id = agency_needs_group.needs_group_id
WHERE agency_needs_group.needs_group_id IS NOT NULL
ORDER BY agency.initials;

-- Agency dropdown filtered with needs group selected
SELECT
	agency.initials,
	agency.name
FROM agency
LEFT JOIN agency_needs_group ON
	agency_needs_group.agency_initials = agency.initials
LEFT JOIN needs_group ON
	needs_group.id = agency_needs_group.needs_group_id
WHERE agency_needs_group.needs_group_id = 10
ORDER BY agency.initials;

-- Agency dropdown filtered with policy area selected
SELECT
	agency.initials,
	agency.name
FROM agency
LEFT JOIN agency_needs_group ON
	agency_needs_group.agency_initials = agency.initials
LEFT JOIN needs_group ON
	needs_group.id = agency_needs_group.needs_group_id
WHERE needs_group.policy_area_id = 2
ORDER BY agency.initials;

-- Policy area dropdown
SELECT
	id,
	description
FROM policy_area;

-- Policy area dropdown filtered with needs group selected
SELECT
	policy_area.id,
	policy_area.description
FROM policy_area
LEFT JOIN needs_group
	ON needs_group.policy_area_id = policy_area.id
WHERE needs_group.id = 1;

-- Policy area dropdown filtered with agency selected
SELECT
	policy_area.id,
	policy_area.description
FROM policy_area
LEFT JOIN needs_group
	ON needs_group.policy_area_id = policy_area.id
LEFT JOIN agency_needs_group
	ON agency_needs_group.needs_group_id = needs_group.id
WHERE agency_needs_group.agency_initials = 'DOE';

-- Needs group dropdown
SELECT id, description FROM needs_group;

-- Needs group dropdown filtered for policy area
SELECT id, description FROM needs_group
WHERE needs_group.policy_area_id = 2;

-- Needs group downdown filtered for agencies
SELECT
	needs_group.id,
	needs_group.description
FROM needs_group
LEFT JOIN agency_needs_group ON
	agency_needs_group.needs_group_id = needs_group.id
WHERE agency_needs_group.agency_initials = 'DOT';
