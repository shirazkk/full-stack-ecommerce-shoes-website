const mockFrom = jest.fn(() => ({
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
}));

const supabase = {
  from: mockFrom,
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
  },
};

const createServerClient = jest.fn(() => ({
  from: mockFrom,
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
  },
}));

module.exports = { supabase, createServerClient };
