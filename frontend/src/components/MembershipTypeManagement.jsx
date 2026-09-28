import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8080/api';

export default function MembershipTypeManagement() {
  const [types, setTypes] = useState([]);

  const [form, setForm] = useState({
    typeName: '',
    borrowLimit: '',
    membershipDurationMonths: '',
    feeAmount: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // UI-only section state. No business logic/API behavior is changed.
  const [sectionOpen, setSectionOpen] = useState(false);

  useEffect(() => {
    const handleSectionChange = (event) => {
      setSectionOpen(event.detail === 'types');
    };

    window.addEventListener(
      'membership-section-change',
      handleSectionChange
    );

    return () => {
      window.removeEventListener(
        'membership-section-change',
        handleSectionChange
      );
    };
  }, []);

  const fetchTypes = async () => {
    try {
      setError('');

      const res = await fetch(
        `${API_BASE}/membership-types`
      );

      if (!res.ok) {
        throw new Error(
          'Failed to load membership types'
        );
      }

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
    setSuccess('');
  };

  const resetForm = () => {
    setForm({
      typeName: '',
      borrowLimit: '',
      membershipDurationMonths: '',
      feeAmount: '',
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
        feeAmount: Number(form.feeAmount),
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
          data.error ||
            'Failed to save membership type'
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
      feeAmount: type.feeAmount ?? '',
    });

    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Delete this membership type?'
      )
    ) {
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
          data.error ||
            'Failed to delete membership type'
        );
      }

      setSuccess(
        'Membership type deleted successfully.'
      );

      await fetchTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      id="membership-section-types"
      className="animate-fade-in"
      style={{ marginTop: '14px' }}
    >
      {/* COLLAPSED / EXPANDED SECTION HEADER */}
      <div
        className="card"
        style={{
          overflow: 'hidden',
          marginBottom: sectionOpen ? '16px' : '0',
        }}
      >
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent(
                'membership-section-change',
                {
                  detail: sectionOpen
                    ? 'members'
                    : 'types',
                }
              )
            );
          }}
          style={{
            width: '100%',
            border: 0,
            background: 'transparent',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            ⚙
          </span>

          <span style={{ flex: 1 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 750,
                color: 'var(--text-main)',
              }}
            >
              Membership Categories
            </span>

            <span
              style={{
                display: 'block',
                marginTop: '3px',
                color: 'var(--text-muted)',
                fontSize: '0.76rem',
              }}
            >
              Configure borrowing limits, validity periods and fees.
            </span>
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <span>{types.length} categories</span>
            <span
              style={{
                fontSize: '18px',
                transform: sectionOpen
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)',
                transition:
                  'transform 0.2s ease',
              }}
            >
              ⌄
            </span>
          </span>
        </button>
      </div>

      {sectionOpen && (
        <div className="animate-fade-in">

          {/* SECTION CONTENT */}

          <div className="section-header">
            <div>
              <h2 className="section-title">
                Membership Category Management
              </h2>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.88rem',
                }}
              >
                Manage membership categories, borrowing
                limits, membership validity periods and
                membership fees.
              </p>
            </div>
          </div>

      {/* =========================
          ALERTS
      ========================== */}

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

      {/* =========================
          ADD / EDIT FORM
      ========================== */}

      <div
        className="card"
        style={{
          marginBottom: '2rem',
        }}
      >

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

            {/* Membership Type */}

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

            {/* Borrow Limit */}

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

            {/* Duration */}

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
                value={
                  form.membershipDurationMonths
                }
                onChange={handleChange}
                required
              />

            </div>

            {/* Membership Fee */}

            <div className="form-group">

              <label className="form-label">
                Membership Fee (LKR) *
              </label>

              <input
                type="number"
                name="feeAmount"
                className="form-input"
                min="0"
                step="0.01"
                placeholder="e.g. 500"
                value={form.feeAmount}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Buttons */}

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

      {/* =========================
          MEMBERSHIP TYPES TABLE
      ========================== */}

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
                <th>Fee</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {types.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color:
                        'var(--text-secondary)',
                    }}
                  >
                    No membership types found.
                  </td>

                </tr>

              ) : (

                types.map((type) => (

                  <tr key={type.id}>

                    {/* Type */}

                    <td>
                      <strong>
                        {type.typeName}
                      </strong>
                    </td>

                    {/* Borrow Limit */}

                    <td>
                      {type.borrowLimit} Books
                    </td>

                    {/* Duration */}

                    <td>
                      {
                        type.membershipDurationMonths
                      }{' '}
                      Months
                    </td>

                    {/* Fee */}

                    <td>
                      LKR{' '}
                      {Number(
                        type.feeAmount || 0
                      ).toFixed(2)}
                    </td>

                    {/* Actions */}

                    <td>

                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                        }}
                      >

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            handleEdit(type)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            color:
                              'var(--danger)',
                            borderColor:
                              'var(--danger)',
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

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

        </div>
      )}
    </div>
  );
}