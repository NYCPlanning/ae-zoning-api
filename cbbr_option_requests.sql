-- Agency dropdown filtered to those with community board budget requests
SELECT
	initials,
	name
FROM agency
WHERE
	community_board_budget_request_needs_group_id IS NOT NULL

-- Agency dropdown filtered with needs group selected
SELECT initials, name FROM agency
WHERE community_board_budget_request_needs_group_id = 3;

-- Agency dropdown filtered with policy area selected
SELECT initials, name FROM agency
LEFT JOIN needs_group
	ON needs_group.id = community_board_budget_request_needs_group_id
WHERE policy_area_id = 2;

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
LEFT JOIN agency
	ON agency.community_board_budget_request_needs_group_id = needs_group.id
WHERE agency.initials = 'DOE';

SELECT needs_group.policy_area_id FROM needs_group  WHERE policy_area_id = 1;

-- Needs group dropdown
SELECT id, description FROM needs_group;

-- Needs group dropdown filtered for policy area
SELECT id, description FROM needs_group
WHERE policy_area_id = 2;

-- Needs group downdown filtered for agencies
SELECT
	needs_group.id,
	needs_group.description
FROM needs_group
LEFT JOIN agency ON
	agency.community_board_budget_request_needs_group_id = needs_group.id
WHERE agency.initials = 'DOT';
