import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

export default function MembershipTypeManagement() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    typeName: '',
    borrowLimit: '',
    membershipDurationMonths: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/membership-types`);
      if (!res.ok) throw new Error('Failed to load membership types');

      const data = await res.json();
      setTypes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const resetForm = () => {
    setForm({
      typeName: '',
      borrowLimit: '',
      membershipDurationMonths: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        typeName: form.typeName.trim(),
        borrowLimit: Number(form.borrowLimit),
        membershipDurationMonths: Number(
          form.membershipDurationMonths
        ),
      };

      const url = editingId
        ? `${API_BASE}/membership-types/${editingId}`
        : `${API_BASE}/membership-types`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to save membership type'
        );
      }

      setSuccess(
        editingId
          ? 'Membership type updated successfully.'
          : 'Membership type created successfully.'
      );

      resetForm();
      await fetchTypes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type) => {
    setEditingId(type.id);

    setForm({
      typeName: type.typeName,
      borrowLimit: type.borrowLimit,
      membershipDurationMonths:
        type.membershipDurationMonths,
    });

    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this membership type?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(
        `${API_BASE}/membership-types/${id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to delete membership type'
        );
      }

      setSuccess('Membership type deleted successfully.');
      await fetchTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in">

      <div className="section-header">
        <div>
          <h2 className="section-title">
            Membership Type Management
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
            }}
          >
            Manage membership categories, borrowing limits
            and membership validity periods.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            marginBottom: '1.25rem',
          }}
        >
          {editingId
            ? 'Edit Membership Type'
            : 'Add Membership Type'}
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label className="form-label">
                Membership Type *
              </label>

              <input
                type="text"
                name="typeName"
                className="form-input"
                placeholder="e.g. Student"
                value={form.typeName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Borrow Limit *
              </label>

              <input
                type="number"
                name="borrowLimit"
                className="form-input"
                min="1"
                placeholder="e.g. 3"
                value={form.borrowLimit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Duration (Months) *
              </label>

              <input
                type="number"
                name="membershipDurationMonths"
                className="form-input"
                min="1"
                placeholder="e.g. 12"
                value={form.membershipDurationMonths}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
            }}
          >
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : editingId
                  ? 'Update Membership Type'
                  : 'Add Membership Type'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>

        </form>
      </div>

      {/* Membership Types Table */}
      <div className="card">

        <div className="section-header">
          <h3 className="section-title">
            Membership Types ({types.length})
          </h3>
        </div>

        <div className="table-responsive">
          <table className="custom-table">

            <thead>
              <tr>
                <th>Type</th>
                <th>Borrow Limit</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {types.map((type) => (
                <tr key={type.id}>

                  <td>
                    <strong>{type.typeName}</strong>
                  </td>

                  <td>
                    {type.borrowLimit} Books
                  </td>

                  <td>
                    {type.membershipDurationMonths} Months
                  </td>

                  <td>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                      }}
                    >
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(type)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-secondary btn-sm"
                        style={{
                          color: 'var(--danger)',
                          borderColor: 'var(--danger)',
                        }}
                        onClick={() =>
                          handleDelete(type.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}